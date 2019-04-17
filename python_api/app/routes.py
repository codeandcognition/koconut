from app import app
from flask import request, Response
import re
import json
import secrets
import subprocess
import os
from flask_cors import cross_origin

JSON_TYPE = "application/json"
TEXT_TYPE = "text/plain"

# Question types
FILL_BLANK = "fillBlank"
MULTIPLE_CHOICE = "multipleChoice"
SHORT_ANSWER = "shortAnswer"

@app.route("/checker/writecode", methods=["POST"])
@cross_origin()
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
        user_output = subprocess.check_output(["python", "temp/{}.py".format(filename_user_answer)],
            universal_newlines=True)
        test_output = subprocess.check_output(["python", "temp/{}.py".format(filename_test_code)], 
            universal_newlines=True)
        
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

    # get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", "")
    expected_answer = req_body.get("expectedAnswer", "")

    if expected_answer != user_answer:
        resp_body = {
            "pass": False,
            "failMessage": "Wrong answer selected"
        }
        resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
        return resp
        
    resp_body = {
        "pass": True
    }
    resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
    return resp

@app.route("/checker/shortanswer", methods=["Post"])
def shortanswer_handler():
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

    # get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", "")
    question_code = req_body.get("questionCode", "")
    expected_answer = req_body.get("expectedAnswer", "")

    if question_code != "":
        # Create hash for temp file
        filename_test_code = secrets.token_urlsafe(16)

        # put code into temp file
        file_test_code = open("temp/{}.py".format(filename_test_code), "w")
        file_test_code.write(question_code)

        # close file
        file_test_code.close()

        # check std output of file
        test_output = ""
        try:
            test_output = subprocess.check_output(["python", "temp/{}.py".format(filename_test_code)], 
                universal_newlines=True)

            # remove file
            os.remove("temp/{}.py".format(filename_test_code))
        except subprocess.CalledProcessError as exc:
            os.remove("temp/{}.py".format(filename_test_code))
            # should never hit here
            resp = Response("Test failed to be parsed. Internal server error", status=500, 
                mimetype=TEXT_TYPE)
            return resp
   
        if test_output != user_answer:
            expected, got = ("", "")
            split_user_output = user_answer.split("\n")
            split_test_output = test_output.split("\n")
            for idx, line in enumerate(split_test_output):
                if split_user_output[idx] != line:
                    expected = line
                    got = split_user_output[idx]
                    break
            resp_body = {
                "pass": False,
                "failMessage": "Expected {} but got {}".format(expected, got) # TODO: For these, we should probably not send the answer alongside the result, but for now it is fine as a test
            }
            resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
            return resp
    
    if user_answer != expected_answer:
        resp_body = {
            "pass": False,
            "failMessage": "Expected {} but got {}".format(expected_answer, user_answer)
        }
        resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
        return resp      
    
    resp_body = {
        "pass": True
    }
    resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
    return resp

@app.route("/checker/table", methods=["Post"])
def table_handler():
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

    # get request body
    req_body = request.get_json()
    questions = req.body.get("questions")
    answers = req.body.get("answer")

    results = []
    # iterate through each row and col of the questions/answers
    for i, question_row in enumerate(questions):
        results.append([])
        # https://stackoverflow.com/questions/2905965/creating-threads-in-python 
        # TODO: Multithread this to make it more performant (not necessary unless app grows a ton)
        for j, question in enumerate(question_row):
            # results[i].append()
            if question["type"] == FILL_BLANK:
                # TODO: if code is defined, then run code instead of compare 
                user_answer = answers[i][j]
                if question["code"] != "":
                    actual_answer = question["answer"]
                    correctness = fill_blank_question_check_correctness(actual_answer, user_answer)
                    if correctness:
                        results[i].append({
                            "pass": True,
                        })
                    else:
                        results[i].append({
                            "pass": False,
                            "failMessage": "Expected {} but got {}".format(actual_answer, user_answer)
                        })
                else:
                    # TODO: Run the code
                    # TODO:
                    # Fillblank questions will compare the output to the user's input.
                    # Writecode questions will compare the output to the user's output
                    ran_code = fill_blank_run_code(user_answer, question["code"])
                    results[i].append(ran_code)

            elif question["type"] == MULTIPLE_CHOICE:
                # MULTIPLE_CHOICE is the same as FILL_BLANK at the moment, but we can change it
                # in the future to incorporate different functionality
                actual_answer = question["answer"]
                user_answer = answers[i][j]
                correctness = multiple_choice_question_check_correctness(actual_answer, user_answer)
                if correctness:
                    results[i].append({
                        "pass": True,
                    })
                else:
                    results[i].append({
                        "pass": False,
                        "failMessage": "Expected {} but got {}".format(actual_answer, user_answer)
                    })

def fill_blank_question_check_correctness(actual_answer, user_answer):
    """
    fill_blank_question_check_correctness compares the actual answer to the user's answer

    This function is only for if there is no code provided  

    a true is returned if it is correct, a false is returned if it is wrong

    In the future this method can be expanded to provide specialized responses per each wrong answer
    but that is a reach goal
    """
    return actual_answer.strip() == user_answer.strip()

def multiple_choice_question_check_correctness(actual_answer, user_answer):
    """
    Similar to fill_blank_question_check_correctness this method can be expanded to provide
    specialized responses per each wrong answer
    """
    return actual_answer.strip() == user_answer.strip()

def fill_blank_run_code(user_answer, test_code):
    """
    fill_blank_run_code will take in the user's answer and test code and then process it to check
    correctness.

    It will return the response body for the message, not the response itself. 
    """
    # Create random hashes for each temp file for no overlap
    filename_test_code = secrets.token_urlsafe(16)

    # Put code into those temp files
    file_test_code = open("temp/{}.py".format(filename_test_code), "w")
    file_test_code.write(test_code)

    # Close the files
    file_test_code.close()

    # Check the std output of all files
    test_output = ""
    try:
        test_output = subprocess.check_output(["python", "temp/{}.py".format(filename_test_code)], 
            universal_newlines=True)
        
        # remove the files
        os.remove("temp/{}.py".format(filename_test_code))
    except subprocess.CalledProcessError as exc:
        # if there is an error, remove the files and then fail because of an error
        os.remove("temp/{}.py".format(filename_test_code))
        resp_body = {
            "pass": False,
            "failMessage": "Unable to compile code"
        }
        return resp_body
    
    if test_output == user_answer:
        resp_body = {
            "pass": True
        }
        return resp_body
    expected, got = ("", "")
    split_user_answer = user_answer.split("\n")
    split_test_output = test_output.split("\n")
    for idx, line in enumerate(split_test_output):
        if split_user_answer[idx] != line:
            expected = line
            got = split_user_answer[idx]
            break
    resp_body = {
        "pass": False,
        "failMessage": "Expected {} but got {}".format(expected, got)
    }
    return resp_body

def is_req_json_type(request):
    return request.headers.get("Content-Type") != JSON_TYPE
