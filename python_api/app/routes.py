from app import app
from flask import request, Response
import re
import json
import secrets
import subprocess
import os
from flask_cors import cross_origin
from .bkt import posterior_pknown, order_next_questions
import pandas as pd

JSON_TYPE = "application/json"
TEXT_TYPE = "text/plain"

# Question types
FILL_BLANK = "fillBlank"
MULTIPLE_CHOICE = "multipleChoice"
SHORT_ANSWER = "shortAnswer"
WRITE_CODE = "writeCode"
TABLE = "table"
SELECT_MULTIPLE = "selectMultiple"
CHECKBOX_QUESTION = "checkboxQuestion"
MEMORY_TABLE = "memoryTable"


@app.route(f"/checker/{WRITE_CODE}", methods=["POST"])
@cross_origin()
def writecode_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_not_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # Get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", "")
    test_code = req_body.get("testCode", "")

    # TODO: REFACTOR USING METHOD DEFINED BELOW

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


@app.route(f"/checker/{MULTIPLE_CHOICE}", methods=["POST"])
@cross_origin()
def multiplechoice_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_not_json_type(request)):
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


@app.route(f"/checker/{SHORT_ANSWER}", methods=["POST"])
@cross_origin()
def shortanswer_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_not_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", "")
    question_code = req_body.get("questionCode", "")
    expected_answer = req_body.get("expectedAnswer", "")

    if question_code != "":
        resp_body = fill_blank_run_code(user_answer, question_code)
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


@app.route(f"/checker/{CHECKBOX_QUESTION}", methods=["POST"])
@cross_origin()
def checkbox_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_not_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", None)
    expected_answer = req_body.get("expectedAnswer", None)

    if user_answer is None or expected_answer is None:
        resp = Response("An error occurred when decoding question",
                        status=500, mimetype=TEXT_TYPE)
        return resp

    resp_body = checkbox_question_check_correctness(
        expected_answer, user_answer)
    resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
    return resp


@app.route(f"/checker/{TABLE}", methods=["Post"])
@cross_origin()
def table_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_not_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # get request body
    req_body = request.get_json()
    questions = req_body.get("questions")
    answers = req_body.get("userAnswer")

    results = []
    # iterate through each row and col of the questions/answers
    for i, question_row in enumerate(questions):
        results.append([])
        # https://stackoverflow.com/questions/2905965/creating-threads-in-python
        # TODO: Multithread this to make it more performant (not necessary unless app grows a ton)
        for j, question in enumerate(question_row):
            if question["type"] == FILL_BLANK:
                user_answer = answers[i][j]
                if question["code"] == "":
                    actual_answer = question["answer"]
                    correctness = fill_blank_question_check_correctness(
                        actual_answer, user_answer)
                    if correctness:
                        results[i].append({
                            "pass": True,
                        })
                    else:
                        results[i].append({
                            "pass": False,
                            "failMessage": "Expected {} but got {}".format(actual_answer,
                                                                           user_answer)
                        })
                else:
                    ran_code = fill_blank_run_code(
                        user_answer, question["code"])
                    results[i].append(ran_code)

            elif question["type"] == MULTIPLE_CHOICE:
                # MULTIPLE_CHOICE is the same as FILL_BLANK at the moment, but we can change it
                # in the future to incorporate different functionality
                actual_answer = question["answer"]
                user_answer = answers[i][j]
                correctness = multiple_choice_question_check_correctness(
                    actual_answer, user_answer)
                if correctness:
                    results[i].append({
                        "pass": True,
                    })
                else:
                    results[i].append({
                        "pass": False,
                        "failMessage": "Expected {} but got {}".format(actual_answer, user_answer)
                    })
            elif question["type"] == WRITE_CODE:
                user_answer = answers[i][j]
                test_code = question["code"]
                ran_code = write_code_run_code(user_answer, test_code)
                results[i].append(ran_code)
            elif question["type"] == SELECT_MULTIPLE or question["type"] == CHECKBOX_QUESTION:
                # checkbox questions expect the answer to be in an array of choices
                user_answer = answers[i][j]
                actual_answer = question["answer"]
                results[i].append(checkbox_question_check_correctness(
                    actual_answer, user_answer))
            else:
                results[i].append({
                    "blank": True
                })
    resp = Response(json.dumps(results), status=200, mimetype=JSON_TYPE)
    return resp


def checkbox_question_check_correctness(actual_answer, user_answer):
    """
    checkbox_question_check_correctness compares the actual checkbox answer to the user's answer

    The way this function is implemented internally is that it sorts the two arrays and compares 
    each value for the previous one. Therefore, it doesn't check WHICH ones are correct, it just
    checks if the entire solution is matching. If we want to give personalized responses or mark
    which one is wrong, we must check these individually with some other method. But for now, 
    this will do. 

    TODO: Make this more robust and check which choices in specific are wrong
    """
    actual = actual_answer[:]
    user = user_answer[:]

    if len(actual) != len(user):
        return {
            "pass": False,
            "failMessage": f"Expected {len(actual)} choices chosen but got {len(user)}"
        }
    actual.sort()
    user.sort()

    for idx, ans in enumerate(actual):
        if ans != user[idx]:
            return {
                "pass": False,
                "failMessage": f"Expected {ans} but got {user[idx]}"
            }
    return {
        "pass": True
    }


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


@app.route(f"/checker/{MEMORY_TABLE}", methods=["POST"])
@cross_origin()
def memorytable_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if (is_req_not_json_type(request)):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # Get request body
    req_body = request.get_json()
    user_answer = req_body.get("userAnswer", "")
    expected_answer = req_body.get("expectedAnswer", "")

    resp_body = memorytable_check_correctness(user_answer, expected_answer)
    resp = Response(json.dumps(resp_body), status=200, mimetype=JSON_TYPE)
    return resp


def memorytable_check_correctness(user_answer, expected_answer):
    """
    memorytable_check_correctness will compare the user answer dictionary to the expected answer and
    make sure that they are a deep copy. 

    It does not incorporate any code checking at all, just string comparisons. 
    """
    for variable, expected_values in expected_answer:
        if variable not in user_answer:
            return {
                "pass": False,
                "failMessage": f"Expected variable {variable} not provided."
            }
        user_values = user_answer[variable]
        if len(expected_values) != len(user_values):
            return {
                "pass": False,
                "failMessage": f"Length of expected values for {variable} is different."
            }
        for idx, expected_value in expected_values:
            user_value = user_values[idx]
            if expected_value.strip() != user_value.strip():
                return {
                    "pass": False,
                    "failMessage": f"Values for {variable} are incorrect."
                }
    return {
        "pass": True
    }


def write_code_run_code(user_answer, test_code):
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
        return resp_body
    if test_output == user_output:
        resp_body = {
            "pass": True
        }
        return resp_body
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
    return resp_body


def is_req_not_json_type(request):
    return request.headers.get("Content-Type") != JSON_TYPE


@app.route("/bkt", methods=["POST"])
@cross_origin()
def bkt_handler():
    # Make sure is POST request
    if request.method != "POST":
        resp = Response("Must be a POST request",
                        status=405, mimetype=TEXT_TYPE)
        return resp

    # Make sure is JSON request body
    if is_req_not_json_type(request):
        resp = Response("Request body must be JSON",
                        status=415, mimetype=TEXT_TYPE)
        return resp

    # get request body
    req_body = request.get_json()

    is_correct = req_body.get("isCorrect", None)
    read_or_write = req_body.get("readOrWrite", None)
    eid = req_body.get("exerciseID", None)
    transfer = req_body.get("transfer", None)
    item_params = req_body.get("itemParams", None)
    item_params_df = None
    try:
        item_params_df = convert_item_params_to_dataframe(item_params)
    except Exception as exc:
        resp = Response(f"Error: {exc}", status=400, mimetype=TEXT_TYPE)
        return resp
    prior_pknown = req_body.get("priorPknown", None)
    exercise_ids = req_body.get("exerciseIDs", None)

    if (is_correct is None) or (eid is None) \
            or (transfer is None) or (item_params_df is None) \
            or (prior_pknown is None) or (exercise_ids is None) \
            or (read_or_write is None):
        resp = Response("You are missing a field",
                        status=400, mimetype=TEXT_TYPE)
        return resp

    pk_new = None
    try:
        pk_new = posterior_pknown(
            is_correct, eid, transfer, item_params_df, prior_pknown)
    except Exception as exc:
        resp = Response(f"Error: {exc}", status=400, mimetype=TEXT_TYPE)
        return resp

    # TODO: This may be returned as an un-serializable object (Series), will have to
    # call a function to convert to list if so
    suggested_exercises = order_next_questions(
        exercise_ids, pk_new, item_params)

    results = {
        "pkNew": pk_new,
        "suggestedExercises": suggested_exercises
    }
    resp = Response(json.dumps(results), status=200, mimetype=JSON_TYPE)
    return resp


def convert_item_params_to_dataframe(item_params):
    """
    item_params is json array:
        [
            {
                eid: string,
                slip: float,
                guess: float,
                concept: string,
            }
        ]

    returns pandas representation of this json array
    """
    for item in item_params:
        if len(item) != 4:
            raise ValueError("Invalid item params provided")
        if ("eid" not in item) or ("slip" not in item) or ("guess" not in item) or ("concept" not in item):
            raise ValueError("Invalid item params provided")
    return pd.DataFrame(item_params)
