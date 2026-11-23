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
    conn.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
        )
    """)

    conn.execute("""
    CREATE TABLE IF NOT EXISTS focus_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        minutes INTEGER NOT NULL,
        scene TEXT NOT NULL,
        finished_at TEXT NOT NULL
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

def delete_checkin(user_id, checkin_id):
    conn = get_connection()
    cursor = conn.execute(
        "DELETE FROM checkins WHERE id = ? AND user_id = ?", (checkin_id, user_id)
    )
    conn.commit()
    deleted = cursor.rowcount == 1
    conn.close()
    return deleted

def add_task(user_id, text):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO tasks (user_id, text, created_at) VALUES (?, ?, ?)",
        (user_id, text, now),
    )
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return task_id


def get_tasks(user_id):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM tasks WHERE user_id = ? ORDER BY done, id DESC", (user_id,) 
    ).fetchall()
    conn.close()

    tasks = []
    for row in rows:
        tasks.append({
            "id": row["id"],
            "text": row["text"],
            "done": row["done"] == 1,
        })
    return tasks

def set_tasks_done(user_id, task_id, done):
    conn = get_connection()
    cursor = conn.execute(
        "UPDATE tasks SET done = ? WHERE id = ? AND user_id = ?",
        (1 if done else 0, task_id, user_id),
    )
    conn.commit()
    changed = cursor.rowcount == 1
    conn.close()
    return changed

def delete_task(user_id, task_id):
    conn = get_connection()
    cursor = conn.execute(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id)
    )

    conn.commit()
    deleted = cursor.rowcount == 1
    conn.close()
    return deleted

def save_session(user_id, minutes, scene):
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO focus_sessions (user_id, minutes, scene, finished_at) VALUES (?, ?, ?, ?)", (user_id, minutes, scene, now)
    )
    conn.commit()
    session_id = cursor.lastrowid
    conn.close()
    return session_id

def get_sessions(user_id):
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY id DESC", (user_id,)
    ).fetchall()
    conn.close()

    sessions = []
    for row in rows:
        sessions.append({
            "id": row["id"],
            "minutes": row["minutes"],
            "scene": row["scene"],
            "finished_at": row["finished_at"],
        })
    return sessions