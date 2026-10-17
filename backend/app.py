import sys
sys.path.append("ai")

from flask import Flask, request, jsonify
from analysis import analyze

app = Flask(__name__)

@app.route("/")
def home():
    return "Pause backend is running..."

@app.route("/api/analyze", methods = ["POST"])
def api_analyze():
    data = request.get_json(silent=True) or {}
    text = data.get("text", "")

    result = analyze(text)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5050)