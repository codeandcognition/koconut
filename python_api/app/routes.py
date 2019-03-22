from app import app
from flask import request, Response
import re
import json

JSON_TYPE = "application/json"
TEXT_TYPE = "text/plain"


@app.route("/v1/runcode", methods=["POST"])
def runcode_handler():
    # request method for POST request
    if request.method == "POST":

        # Get request body
        req_body = request.get_json()

        # Check question type -- TODO
        abc = {}
        resp = Response(json.dumps(abc), status=200, mimetype=JSON_TYPE)

        return resp
    else:
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)

        return resp
