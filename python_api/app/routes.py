from app import app
from flask import request, Response
import re
import json
import secrets
import subprocess
import os

JSON_TYPE = "application/json"
TEXT_TYPE = "text/plain"


@app.route("/checker/writecode", methods=["POST"])
def writecode_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # Get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", "")
    test_code = req_body.get("testCode", "")

    # Create random hashes for each temp file for no overlap
    filename_user_answer = secrets.token_urlsafe(16)
    filename_test_code = secrets.token_urlsafe(16)

    # Put code into those temp files
    file_user_answer = open("temp/{}.py".format(filename_user_answer), "w")
    file_test_code = open("temp/{}.py".format(filename_test_code), "w")
    file_user_answer.write(user_answer)
    file_test_code.write(test_code)

    # Close the files
    file_user_answer.close()
    file_test_code.close()

    # Check the std output of all files
    user_output = ""
    test_output = ""
    try:
        user_output = subprocess.check_output(["python", "temp/{}.py".format(filename_user_answer)], universal_newlines=True)
        test_output = subprocess.check_output(["python", "temp/{}.py".format(filename_test_code)], universal_newlines=True)
        
        # remove the files
        os.remove("temp/{}.py".format(filename_user_answer))
        os.remove("temp/{}.py".format(filename_test_code))
    except subprocess.CalledProcessError as exc:
        # if there is an error, remove the files and then fail because of an error
        os.remove("temp/{}.py".format(filename_user_answer))
        os.remove("temp/{}.py".format(filename_test_code))
        resp_body = {
            "pass": False,
            "failMessage": "Unable to compile code"
        }
        resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
        return resp
    
    if test_output == user_output:
        resp_body = {
            "pass": True
        }
        resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
        return resp
    expected, got = ("", "")
    split_user_output = user_output.split("\n")
    split_test_output = test_output.split("\n")
    for idx, line in enumerate(split_test_output):
        if split_user_output[idx] != line:
            expected = line
            got = split_user_output[idx]
            break
    resp_body = {
        "pass": False,
        "failMessage": "Expected {} but got {}".format(expected, got)
    }
    resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
    return resp

@app.route("/checker/multiplechoice", methods=["POST"])
def multiplechoice_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    

def is_req_json_type(request):
    return request.headers.get("Content-Type") != JSON_TYPE
