# Koconut's Content

From the learner's perspective, an exercise can be thought of as one unit of practice. An exercise can have multiple questions
where some questions are follow up questions of others, or questions are simply grouped together to benefit the learner.

## Question Types
* Survey
* Write code
* Fill blank
* Highlight code
* Multiple choice
* Short response
* Memory table
* Checkbox question

These are the basic question types; some of these types can be used in combination to form more complex questions like 
the following. The following question is formatted as a table that is consists of both multiple choice and fill blank type
questions. 

![Imgur](https://i.imgur.com/KFvpWQR.png)

## Schemas

### Exercise
Required fields
* `concepts`: can have multiple concepts
* `questions`: at least has 1 question object

```JSON
{
  "prompt": "",
  "code": "",
  "concepts": [],
  "questions": [
    {
      "prompt": "A question's prompt field can be left blank",
      "code": "Code can be blank",
      "difficulty": "0, 1 or 2",
      "choices": [
        "choice 1",
        "choice 2",
        "choice 3"
      ],
      "type": "multipleChoice",
      "answer": "choice1",
      "hint": "",
      "feedback": {
        "choice 1": "Correct",
        "choice 2": "Constructive feedback",
        "choice 3": "Constructive feedback"
      },
      "followupPrompt": "",
      "followupQuestions": []
    }
  ]
}
```

### Questions

#### Stand alone questions
Required fields
* `difficulty`: can be 0, 1, or 2
* `answer`: String in most cases. For memory table questions `answer` is a JSON object where the key value pairs are
variable names and an array of the variable values.
* `feedback`: JSON object for multiple choice questions where each key value pair corresponds to a choice and the 
feedback associated with the choice. For other question types, feedback is an array of strings.

__Note about feedback__ <br/>
For the current version of Koconut, feedback is being built into the question. Eventually this 
needs to be replaced with a robust tool that can generate dynamic feedback based on the user's profile.
```JSON
{
    "prompt": "",
    "code": "",
    "difficulty": 0,
    "choices": [],
    "type": "",
    "answer": "",
    "hint": "",
    "feedback": {},
    "followupPrompt": "",
    "followupQuestions": []
}

```

#### Table questions
Questions presented as tables have a slightly different schema
Required fields:
* `colNames`: array of strings representing the column names in the table
* `data`: array of question objects (JSON presented earlier)

```JSON
{
    "prompt": "",
    "code": "",
    "type": "table",
    "colNames": [],
    "data": [],
    "followupPrompt": "",
    "followupQuestions": []
}

```
