import redis
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
cache = redis.Redis(host='redis', port=6379)


@app.route('/health')
def health():
    return jsonify(
        {
            "status": "ok"
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
