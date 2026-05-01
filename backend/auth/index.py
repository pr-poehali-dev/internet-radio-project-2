import json
import os
import hashlib
import secrets
import psycopg2
from datetime import datetime

SCHEMA = 't_p20843780_internet_radio_proje'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    salt = 'pulse_radio_salt_2024'
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
    }

def ok(data):
    return {'statusCode': 200, 'headers': {**cors_headers(), 'Content-Type': 'application/json'}, 'body': json.dumps(data)}

def err(code, msg):
    return {'statusCode': code, 'headers': {**cors_headers(), 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def handler(event: dict, context) -> dict:
    """Авторизация и управление профилем: register, login, logout, me, update"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    if not action:
        path = event.get('path', '/')
        action = path.rstrip('/').split('/')[-1]

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    token = (event.get('headers') or {}).get('X-Auth-Token', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == 'register' and method == 'POST':
            username = (body.get('username') or '').strip()
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            display_name = (body.get('display_name') or username).strip()

            if not username or not email or not password:
                return err(400, 'Заполните все поля')
            if len(password) < 6:
                return err(400, 'Пароль должен быть не менее 6 символов')
            if len(username) < 3:
                return err(400, 'Имя пользователя должно быть не менее 3 символов')

            cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE username=%s OR email=%s", (username, email))
            if cur.fetchone():
                return err(409, 'Пользователь с таким именем или email уже существует')

            pw_hash = hash_password(password)
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (username, email, password_hash, display_name) VALUES (%s, %s, %s, %s) RETURNING id",
                (username, email, pw_hash, display_name)
            )
            user_id = cur.fetchone()[0]

            token_val = secrets.token_hex(32)
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
                (user_id, token_val)
            )
            conn.commit()

            return ok({'token': token_val, 'user': {'id': user_id, 'username': username, 'email': email, 'display_name': display_name, 'avatar_url': None, 'bio': None, 'favorite_genre': None}})

        elif action == 'login' and method == 'POST':
            login = (body.get('login') or '').strip().lower()
            password = body.get('password') or ''

            if not login or not password:
                return err(400, 'Введите логин и пароль')

            pw_hash = hash_password(password)
            cur.execute(
                f"SELECT id, username, email, display_name, avatar_url, bio, favorite_genre FROM {SCHEMA}.users WHERE (lower(email)=%s OR lower(username)=%s) AND password_hash=%s",
                (login, login, pw_hash)
            )
            row = cur.fetchone()
            if not row:
                return err(401, 'Неверный логин или пароль')

            user_id, username, email, display_name, avatar_url, bio, favorite_genre = row
            token_val = secrets.token_hex(32)
            cur.execute(
                f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES (%s, %s)",
                (user_id, token_val)
            )
            conn.commit()

            return ok({'token': token_val, 'user': {'id': user_id, 'username': username, 'email': email, 'display_name': display_name, 'avatar_url': avatar_url, 'bio': bio, 'favorite_genre': favorite_genre}})

        elif action == 'logout' and method == 'POST':
            if token:
                cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at=NOW() WHERE token=%s", (token,))
                conn.commit()
            return ok({'ok': True})

        elif action == 'me' and method == 'GET':
            if not token:
                return err(401, 'Не авторизован')
            cur.execute(
                f"SELECT u.id, u.username, u.email, u.display_name, u.avatar_url, u.bio, u.favorite_genre, u.created_at FROM {SCHEMA}.users u JOIN {SCHEMA}.sessions s ON s.user_id=u.id WHERE s.token=%s AND s.expires_at > NOW()",
                (token,)
            )
            row = cur.fetchone()
            if not row:
                return err(401, 'Сессия истекла, войдите снова')
            user_id, username, email, display_name, avatar_url, bio, favorite_genre, created_at = row
            return ok({'id': user_id, 'username': username, 'email': email, 'display_name': display_name, 'avatar_url': avatar_url, 'bio': bio, 'favorite_genre': favorite_genre, 'created_at': str(created_at)})

        elif action == 'update' and method == 'PUT':
            if not token:
                return err(401, 'Не авторизован')
            cur.execute(f"SELECT user_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()", (token,))
            row = cur.fetchone()
            if not row:
                return err(401, 'Сессия истекла')
            user_id = row[0]

            display_name = body.get('display_name')
            bio = body.get('bio')
            favorite_genre = body.get('favorite_genre')
            avatar_url = body.get('avatar_url')

            cur.execute(
                f"UPDATE {SCHEMA}.users SET display_name=COALESCE(%s, display_name), bio=COALESCE(%s, bio), favorite_genre=COALESCE(%s, favorite_genre), avatar_url=COALESCE(%s, avatar_url), updated_at=NOW() WHERE id=%s RETURNING id, username, email, display_name, avatar_url, bio, favorite_genre",
                (display_name, bio, favorite_genre, avatar_url, user_id)
            )
            row = cur.fetchone()
            conn.commit()
            uid, username, email, dn, au, b, fg = row
            return ok({'id': uid, 'username': username, 'email': email, 'display_name': dn, 'avatar_url': au, 'bio': b, 'favorite_genre': fg})

        else:
            return err(404, 'Не найдено')

    finally:
        cur.close()
        conn.close()