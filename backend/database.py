import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


DB_FILE = "pause.db"

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn
def create_tables():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )
    """)
    conn.execute("""
    CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            text TEXT NOT NULL,
            predicted TEXT,
            chosen TEXT NOT NULL,
            topics TEXT,
            safety TEXT
        )
    """)
       

    conn.commit()
    conn.close()


def create_user(username, password):
    conn = get_connection()
    try:
        cursor = conn.execute(
            "INSERT INTO users (username, password_hash) VALUES (?, ?)",
            (username, generate_password_hash(password)),
        )
        conn.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        user_id = None
    conn.close()
    return user_id

#give back user if username, password is right, otherwise None
def check_login(username, password):
    conn = get_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()

    if user is not None and check_password_hash(user["password_hash"], password):
        return user
    return None

def save_checkin(user_id, text, predicted, chosen, topics, safety):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")

    conn = get_connection()
    conn.execute(
        "INSERT INTO checkins (user_id, created_at, text, predicted, chosen, topics, safety) "
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        (user_id, now, text, predicted, chosen, ",".join(topics), safety)
    )
    conn.commit()
    conn.close()

def get_checkins(user_id):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM checkins WHERE user_id = ? ORDER BY id DESC", (user_id,)
    ).fetchall()
    conn.close()

    checkins = []
    for row in rows:
        checkins.append({
            "id": row["id"],
            "created_at": row["created_at"],
            "text": row["text"],
            "predicted": row["predicted"],
            "chosen": row["chosen"],
            "topics": row["topics"].split(",") if row["topics"] else [],
            "safety": row["safety"],
        })
    return checkins