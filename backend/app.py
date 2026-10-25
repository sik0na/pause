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

    result = analyze(text)
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

if __name__ == "__main__":
    app.run(debug=True, port=5050)