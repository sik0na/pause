import sys
import os
sys.path.append("ai")

from flask import Flask, request, jsonify, session
from analysis import analyze
from support import EMOTION_MESSAGES, TOPIC_TIPS
import database

app = Flask(__name__)

app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change_me")
database.create_tables()

@app.route("/")
def home():
    return "Pause backend is running..."


@app.route("/api/signup", methods = ["POST"])
def api_signup():
    data = request.get_json(silent=True) or {}
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if len(username) < 3:
        return jsonify({"error": "Username must be at least 3 characters."}), 400

    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters."}), 400

    user_id = database.create_user(username, password)

    if user_id is None:
        return jsonify({"error": "That username is already taken."}), 400

    session["user_id"] = user_id
    session["username"] = username
    return jsonify({"username": username})


@app.route("/api/login", methods = ["POST"])
def api_login():
    data = request.get_json(silent=True) or {}
    user = database.check_login(data.get("username", "").strip(), data.get("password", ""))

    if user is None:
        return jsonify({"error": "Wrong username or password."}), 401

    session["user_id"] = user["id"]
    session["username"] = user["username"]
    return jsonify({"username": user["username"]})


@app.route("/api/logout", methods = ["POST"])
def api_logout():
    session.clear()
    return jsonify({"ok": True})



@app.route("/api/me")
def api_me():
    if "user_id" not in session:
        return jsonify({"logged_in": False})
    return jsonify({"logged_in": True, "username": session["username"]})

@app.route("/api/analyze", methods = ["POST"])
def api_analyze():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401
    
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")
    lang = data.get("lang", "en")

    result = analyze(text, lang)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result)

@app.route("/api/checkins", methods = ["POST"])
def api_save_checkin():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401

    data = request.get_json(silent=True) or {}
    text = data.get("text", "").strip()
    chosen = data.get("chosen", "")
    topics = data.get("topics", [])

    if text == "":
        return jsonify({"error": "The check-in has no text."}), 400
    if chosen not in EMOTION_MESSAGES:
        return jsonify({"error": "Unknown emotion."}), 400
    for topic in topics:
        if topic not in TOPIC_TIPS:
            return jsonify({"error": "Unknown topics."}), 400

    database.save_checkin(session["user_id"], text, data.get("predicted"), chosen, topics, data.get("safety"))
    return jsonify({"ok": True})

@app.route("/api/checkins")
def api_get_checkins():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401
    return jsonify({"checkins": database.get_checkins(session["user_id"])})

@app.route("/api/checkins/<int:checkin_id>", methods = ["DELETE"])
def api_delete_checkin(checkin_id):
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401
    if not database.delete_checkin(session["user_id"], checkin_id):
        return jsonify({"error": "Check-in not found."}), 404
    return jsonify({"ok": True})

@app.route("/api/tasks") 
def api_get_tasks():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401
    return jsonify({"tasks": database.get_tasks(session["user_id"])})

@app.route("/api/tasks", methods=["POST"])
def api_add_task():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401

    data = request.get_json(silent = True) or {}
    text = data.get("text", "").strip()

    if text == "":
        return jsonify({"error": "The task has no text."}), 400
    if len(text) > 100:
        return jsonify({"error": "The task is too long."}), 400

    task_id = database.add_task(session["user_id"], text)
    return jsonify({"id": task_id, "text": text, "done": False})

@app.route("/api/tasks/<int:task_id>", methods = ["PATCH"])
def api_update_task(task_id):
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401

    data = request.get_json(silent = True) or {}
    done = data.get("done") is True
    if not database.set_tasks_done(session["user_id"], task_id, done):
        return jsonify({"error": "Task not found."}), 404
    return jsonify({"ok": True})

@app.route("/api/tasks/<int:task_id>", methods =["DELETE"])
def api_delete_task(task_id):
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401
    if not database.delete_task(session["user_id"], task_id):
        return jsonify({"error": "Task not found."}), 404
    return jsonify({"ok": True})

SCENES = ["room", "lake", "city"]

@app.route("/api/sessions", methods = ["POST"])
def api_save_session():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401

    data = request.get_json(silent = True) or {}
    minutes = data.get("minutes")
    scene = data.get("scene")

    if type(minutes) is not int or minutes < 1 or minutes > 120:
        return jsonify({"error": "minutes ust be a number from 1 to 120"}), 400

    if scene not in SCENES:
        return jsonify({"error": "Unknown scene."}), 400

    session_id = database.save_session(session["user_id"], minutes, scene)
    return jsonify({"id": session_id})

@app.route("/api/sessions")
def api_get_sessions():
    if "user_id" not in session:
        return jsonify({"error": "Please log in."}), 401
    return jsonify({"sessions": database.get_sessions(session["user_id"])})

if __name__ == "__main__":
    app.run(debug=True, port=5050)