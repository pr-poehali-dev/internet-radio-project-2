import json
import os
import psycopg2

SCHEMA = 't_p20843780_internet_radio_proje'

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
    }

def ok(data):
    return {'statusCode': 200, 'headers': {**cors(), 'Content-Type': 'application/json'}, 'body': json.dumps(data, default=str)}

def err(code, msg):
    return {'statusCode': code, 'headers': {**cors(), 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def get_user_by_token(cur, token):
    cur.execute(
        f"SELECT user_id FROM {SCHEMA}.sessions WHERE token=%s AND expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    return row[0] if row else None

def handler(event: dict, context) -> dict:
    """Список пользователей и профиль конкретного пользователя"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'list')
    token = (event.get('headers') or {}).get('X-Auth-Token', '')

    conn = get_conn()
    cur = conn.cursor()

    try:
        if action == 'list':
            cur.execute(
                f"SELECT id, username, display_name, avatar_url, bio, favorite_genre, created_at FROM {SCHEMA}.users ORDER BY created_at DESC"
            )
            rows = cur.fetchall()
            users = [
                {'id': r[0], 'username': r[1], 'display_name': r[2], 'avatar_url': r[3], 'bio': r[4], 'favorite_genre': r[5], 'created_at': str(r[6])}
                for r in rows
            ]
            return ok({'users': users})

        elif action == 'get':
            user_id = params.get('id')
            if not user_id:
                return err(400, 'Укажите id пользователя')
            cur.execute(
                f"SELECT id, username, display_name, avatar_url, bio, favorite_genre, created_at FROM {SCHEMA}.users WHERE id=%s",
                (user_id,)
            )
            row = cur.fetchone()
            if not row:
                return err(404, 'Пользователь не найден')
            return ok({'id': row[0], 'username': row[1], 'display_name': row[2], 'avatar_url': row[3], 'bio': row[4], 'favorite_genre': row[5], 'created_at': str(row[6])})

        else:
            return err(404, 'Не найдено')

    finally:
        cur.close()
        conn.close()
