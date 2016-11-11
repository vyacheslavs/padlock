from flask import Flask
from flask_cors import CORS, cross_origin
import json

app = Flask(__name__)
CORS(app)

@app.route("/api/v1/action/ehlo")
def main():

    response = {}
    response['version'] = 1
    response['padlock_server'] = {}
    response['padlock_server']['host'] = 'keepass2.ldd.so';
    response['padlock_server']['port'] = 8008;

    return json.dumps(response);

@app.route("/api/v1/action/helo")
def helo():

    response = {}
    response['version'] = 1
    response['status'] = "online";

    return json.dumps(response);

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=8008)
