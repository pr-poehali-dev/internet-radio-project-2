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
    """Личные сообщения между пользователями: получение диалога, отправка, список диалогов"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors(), 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    token = (event.get('headers') or {}).get('X-Auth-Token', '')

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    conn = get_conn()
    cur = conn.cursor()

    try:
        me = get_user_by_token(cur, token)
        if not me:
            return err(401, 'Не авторизован')

        if action == 'dialogs' and method == 'GET':
            cur.execute(f"""
                SELECT DISTINCT ON (other_id)
                    other_id,
                    u.username, u.display_name, u.avatar_url,
                    last_msg, last_time,
                    unread_count
                FROM (
                    SELECT
                        CASE WHEN sender_id = %s THEN receiver_id ELSE sender_id END AS other_id,
                        text AS last_msg,
                        created_at AS last_time,
                        SUM(CASE WHEN receiver_id = %s AND NOT is_read THEN 1 ELSE 0 END) OVER (PARTITION BY CASE WHEN sender_id = %s THEN receiver_id ELSE sender_id END) AS unread_count,
                        ROW_NUMBER() OVER (PARTITION BY CASE WHEN sender_id = %s THEN receiver_id ELSE sender_id END ORDER BY created_at DESC) AS rn
                    FROM {SCHEMA}.messages
                    WHERE sender_id = %s OR receiver_id = %s
                ) sub
                JOIN {SCHEMA}.users u ON u.id = sub.other_id
                WHERE sub.rn = 1
                ORDER BY other_id, last_time DESC
            """, (me, me, me, me, me, me))
            rows = cur.fetchall()
            dialogs = [
                {'user_id': r[0], 'username': r[1], 'display_name': r[2], 'avatar_url': r[3], 'last_msg': r[4], 'last_time': str(r[5]), 'unread_count': int(r[6])}
                for r in rows
            ]
            return ok({'dialogs': dialogs})

        elif action == 'chat' and method == 'GET':
            other_id = params.get('user_id')
            if not other_id:
                return err(400, 'Укажите user_id')
            other_id = int(other_id)
            cur.execute(f"""
                SELECT id, sender_id, receiver_id, text, is_read, created_at
                FROM {SCHEMA}.messages
                WHERE (sender_id=%s AND receiver_id=%s) OR (sender_id=%s AND receiver_id=%s)
                ORDER BY created_at ASC
            """, (me, other_id, other_id, me))
            rows = cur.fetchall()
            msgs = [{'id': r[0], 'sender_id': r[1], 'receiver_id': r[2], 'text': r[3], 'is_read': r[4], 'created_at': str(r[5])} for r in rows]

            cur.execute(f"""
                UPDATE {SCHEMA}.messages SET is_read=TRUE
                WHERE receiver_id=%s AND sender_id=%s AND NOT is_read
            """, (me, other_id))
            conn.commit()
            return ok({'messages': msgs})

        elif action == 'send' and method == 'POST':
            other_id = body.get('user_id')
            text = (body.get('text') or '').strip()
            if not other_id or not text:
                return err(400, 'Укажите user_id и text')
            if len(text) > 2000:
                return err(400, 'Сообщение слишком длинное')
            cur.execute(
                f"INSERT INTO {SCHEMA}.messages (sender_id, receiver_id, text) VALUES (%s, %s, %s) RETURNING id, created_at",
                (me, int(other_id), text)
            )
            row = cur.fetchone()
            conn.commit()
            return ok({'id': row[0], 'sender_id': me, 'receiver_id': int(other_id), 'text': text, 'is_read': False, 'created_at': str(row[1])})

        else:
            return err(404, 'Не найдено')

    finally:
        cur.close()
        conn.close()
