<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Pseudo-Backend](#pseudo-backend)
-   [BKT](#bkt)
    -   [constructor](#constructor)
    -   [learned](#learned)
    -   [contextualize](#contextualize)
    -   [boundedProbability](#boundedprobability)
    -   [notNullOrUndefined](#notnullorundefined)
-   [ResponseFeaturesTable](#responsefeaturestable)
    -   [ResponseFeatures](#responsefeatures)
    -   [responseIsString](#responseisstring)
    -   [percentPastErrors](#percentpasterrors)
    -   [numberOfLastFiveWrong](#numberoflastfivewrong)
    -   [helpRequest](#helprequest)
    -   [percentHelpRequested](#percenthelprequested)
    -   [numberOfLast8HelpRequested](#numberoflast8helprequested)
    -   [timeTaken](#timetaken)
    -   [timeTakenSD](#timetakensd)
    -   [timeTakenInLast5Actions](#timetakeninlast5actions)
    -   [timeTakenOnThisConcept](#timetakenonthisconcept)
    -   [numberOfTimesUsingConcept](#numberoftimesusingconcept)
    -   [convertMilliToMin](#convertmillitomin)
-   [MasteryModelClass](#masterymodelclass)
    -   [updateModel](#updatemodel)
    -   [surveyUpdateModel](#surveyupdatemodel)
-   [ConceptKnowledge](#conceptknowledge)
    -   [addDependency](#adddependency)
    -   [addParent](#addparent)
    -   [getKnowledge](#getknowledge)
    -   [updateKnowledgeValue](#updateknowledgevalue)
    -   [calculateDependencyKnowledge](#calculatedependencyknowledge)
    -   [updateParentValues](#updateparentvalues)
-   [ExerciseTypes](#exercisetypes)
    -   [isInlineResponseType](#isinlineresponsetype)
    -   [isSurvey](#issurvey)
-   [ExercisePoolClass](#exercisepoolclass)
    -   [addExercise](#addexercise)
    -   [getAnswer](#getanswer)
-   [ExerciseGenerator](#exercisegenerator)
    -   [weightByParabolic](#weightbyparabolic)
    -   [getConceptIndex](#getconceptindex)
    -   [getOrderedConcepts](#getorderedconcepts)
    -   [getConcept](#getconcept)
    -   [getConcepts](#getconcepts)
    -   [getType](#gettype)
    -   [generateExercise](#generateexercise)
-   [ResponseObject](#responseobject)
-   [ResponseLogClass](#responselogclass)
    -   [addResponse](#addresponse)
    -   [getFeedback](#getfeedback)
-   [ResponseEvaluator](#responseevaluator)
    -   [multiplicativeInverseMethod](#multiplicativeinversemethod)
    -   [BKT](#bkt-1)
    -   [calculateCertainty](#calculatecertainty)
    -   [analyzeLog](#analyzelog)
    -   [executeJava](#executejava)
    -   [evaluateAnswer](#evaluateanswer)
    -   [printImportantStuff](#printimportantstuff)
-   [React Components](#react-components)
-   [App](#app)
    -   [getExercise](#getexercise)
    -   [submitResponse](#submitresponse)
    -   [submitConcept](#submitconcept)
    -   [renderExercise](#renderexercise)
    -   [renderConceptSelection](#renderconceptselection)
    -   [renderDisplay](#renderdisplay)
-   [Exercise](#exercise)
    -   [componentWillReceiveProps](#componentwillreceiveprops)
    -   [isAnswered](#isanswered)
-   [Prompt](#prompt)
-   [Information](#information)
    -   [renderCodeView](#rendercodeview)
    -   [renderResponseView](#renderresponseview)
-   [Feedback](#feedback)
-   [Hint](#hint)
-   [Code](#code)
    -   [componentDidMount](#componentdidmount)
    -   [componentWillReceiveProps](#componentwillreceiveprops-1)
    -   [resetCursor](#resetcursor)
    -   [handleThemeChange](#handlethemechange)
    -   [handleSelect](#handleselect)
    -   [handleReset](#handlereset)
    -   [handleHintRequest](#handlehintrequest)
    -   [renderAce](#renderace)
-   [Response](#response)
    -   [renderResponse](#renderresponse)
-   [MultipleChoice](#multiplechoice)
-   [Choice](#choice)
-   [ShortResponse](#shortresponse)
-   [SurveyView](#surveyview)
    -   [handleUpdate](#handleupdate)
    -   [fillAll](#fillall)
    -   [fillAllUniform](#fillalluniform)
    -   [renderChoices](#renderchoices)
-   [Submit](#submit)
    -   [renderSubmitButton](#rendersubmitbutton)
-   [ConceptSelection](#conceptselection)
    -   [render](#render)
-   [Unorganized](#unorganized)

## Pseudo-Backend

The following classes contain "backend" logic that would account for the
'M' and 'C' in "MVC". To be clear, this is separate from the actual Node.js
backend, which exists in the `api/` folder.

All these classes exist in `src/backend` and `src/data`.


## BKT

Class for Bayesian Knowledge Tracing functionality.

### constructor

Construct initial values of BKT model.

### learned

Take in previous K value and correct/incorrect answer to update K value.

**Parameters**

-   `previous` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `response` **[ResponseObject](#responseobject)** 
-   `correct`  

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### contextualize

Updates the G and S parameters contextually

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 
-   `constant` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `param` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### boundedProbability

Ensures that value is not probabilistically degenerate

**Parameters**

-   `num` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### notNullOrUndefined

Returns true if neither null nor undefined

**Parameters**

-   `input` **any** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## ResponseFeaturesTable

### ResponseFeatures

Values for contextualized G and S from Baker et al.
Adjust these values as needed. If we define additional features, add to this
object and append the necessary function below.

### responseIsString

Determines whether the response object was a String response
(WriteCode, FillBlank, or ShortResponse).

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** true if response is string

### percentPastErrors

Determines the percentage of past responses of the same concept that were
errors.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** percentage

### numberOfLastFiveWrong

Determines the percentage of past responses of the same concept that were
errors.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** percentage

### helpRequest

Stub, no help request feature built in yet.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### percentHelpRequested

Stub, no help request feature built in yet.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### numberOfLast8HelpRequested

Stub, no help request feature built in yet.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### timeTaken

Returns number of minutes spent on most recent exercise.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### timeTakenSD

Stub, no collective student data yet.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### timeTakenInLast5Actions

Returns number of minutes spent on last 5 exercises.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### timeTakenOnThisConcept

Returns total number of minutes spent on this concept.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### numberOfTimesUsingConcept

Returns number of times using this concept.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### convertMilliToMin

Helper function to convert milliseconds to minutes

**Parameters**

-   `time` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

## MasteryModelClass

Static class that contains student's knowledge of each concept.

### updateModel

Updates concept in student knowledge model with true/false value.

**Parameters**

-   `concept` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `knowledge` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### surveyUpdateModel

Updates MasteryModel initial values based on survey data.

**Parameters**

-   `initialValues` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)>** 

## ConceptKnowledge

ConceptKnowledge object is a node containing a concept, with a boolean
to represent the student knowing or not knowing.

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### addDependency

Append a dependency to the dependencies.

**Parameters**

-   `c` **[ConceptKnowledge](#conceptknowledge)** 

### addParent

Append a parent to the parents.

**Parameters**

-   `c` **[ConceptKnowledge](#conceptknowledge)** 

### getKnowledge

Returns the current node's knowledge value.

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### updateKnowledgeValue

Update the mastery value for this concept object.
When mastery changes, its parent dependency value will need updating too.

**Parameters**

-   `num` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### calculateDependencyKnowledge

Calculates current node's dependency knowledge.

### updateParentValues

Updates parents' dependency knowledge values.
This is //TODO: an incomplete comment!

## ExerciseTypes

Defines all available exercise types.
Provides logic to determine whether the exercise is an inline response type.

### isInlineResponseType

Determines whether the exercise type is an inline exercise type.
An inline exercise type requires displaying only the code component,
rather than the code and response component.

**Parameters**

-   `type`  the exercise type

Returns **any** whether or not the exercise type requires inline responding

### isSurvey

Determines whether the exercise type is a survey.

**Parameters**

-   `type`  

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## ExercisePoolClass

Stores the exercise pool

### addExercise

Adds an exercise to the exercise pool

**Parameters**

-   `exercise` **[Exercise](#exercise)** the Exercise to add
-   `answer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** the Exercise answer (undefined if the answer must be evaluated)

### getAnswer

Returns the answer for the given Exercise

**Parameters**

-   `exercise` **[Exercise](#exercise)** the Exercise to get an answer for

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** the answer for the given Exercise

## ExerciseGenerator

### weightByParabolic

Weights values closer to 0 more than values close to 1.
As range of mastery narrows, topics' chances gain equality.

**Parameters**

-   `max` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `min` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** [0:1]

### getConceptIndex

Gives optimal index of the next concept to generate questions for.
Index is based on a list of concepts, sorted in this order:
least mastered -> most mastered

**Parameters**

-   `concepts` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[ConceptKnowledge](#conceptknowledge)>** 
-   `method` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### getOrderedConcepts

Returns sorted concepts list sorted by relevance to the user.

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any>** 

### getConcept

Returns the most relevant concept. Relevance determined by
getOrderedConcepts() algorithm.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an exercise concept

### getConcepts

Returns the first N most relevant concepts. Relevance determined
by getOrderedConcepts() algorithm.

**Parameters**

-   `size` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[ConceptKnowledge](#conceptknowledge)>** 

### getType

Returns an exercise type, pulled from exercise type inventory.

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** an exercise type

### generateExercise

Returns a generated Exercise

**Parameters**

-   `concept` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** specifies a concept type if provided

Returns **any** a generated Exercise

## ResponseObject

Stores student performance data for an exercise.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `concept` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `exerciseType` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `difficulty` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `correct` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 
-   `timestamp` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

## ResponseLogClass

Stores collection of student performance data for exercises.

### addResponse

Static function stores submission results into response log.

**Parameters**

-   `id` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `concept` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `exerciseType` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `difficulty` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `correct` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 
-   `timestamp` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### getFeedback

Returns feedback for the last response (currently just correctness)

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** whether the last response was correct

## ResponseEvaluator

### multiplicativeInverseMethod

Takes in a relevant set of responses, and a weight that scales how strong
of a differential would be required to reach a level of certainty that the
student has learned a concept.
f(x) = -k/(x+k) + 1, where k is the weight value.

**Parameters**

-   `responses` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[ResponseObject](#responseobject)>** 
-   `concept`  

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### BKT

Uses Bayesian Knowledge Tracing to update knowledge value.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### calculateCertainty

Calculates certainty of knowing given a method.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 
-   `method` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** 

Returns **any** 

### analyzeLog

Calculates certainty using specific analysis method.

**Parameters**

-   `response` **[ResponseObject](#responseobject)** 

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### executeJava

Send a POST request to the API to compile and execute the given Java code

**Parameters**

-   `code` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the Java code to compile and execute

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### evaluateAnswer

TODO: Make this have logic.
Takes in an exercise and student response to update log and mastery model.

**Parameters**

-   `exercise` **[Exercise](#exercise)** 
-   `answer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

### printImportantStuff

Debugging method for quick analysis of CK behavior through console

## React Components

The remaining classes are React components which make up the frontend view
of _koconut_.

All these classes exist in `src/ui`.


## App

**Extends Component**

Renders the koconut application view.

### getExercise

Return a generated exercise
TODO: Remove, this is redundant?

Returns **[Exercise](#exercise)** a generated exercise

### submitResponse

Submits the give answer to current exercise

**Parameters**

-   `answer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the answer being submitted

### submitConcept

Submits the given concept

**Parameters**

-   `concept` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** the concept being submit

### renderExercise

Renders the exercise view

### renderConceptSelection

Renders the concept selection view

### renderDisplay

Renders the display based on display state

## Exercise

**Extends Component**

The Exercise container contains all components of an assessment problem.

**Parameters**

-   `props` **Props** 

### componentWillReceiveProps

Updates the Exercise state when receiving a new props object

### isAnswered

Returns whether the answer is defined and non-null or not.

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

## Prompt

**Extends Component**

The Prompt component contains the assessment prompt.

## Information

**Extends Component**

The Information container contains Code or both Code and Response.

### renderCodeView

Returns JSX for (or not for) the Code container given the current props

Returns **any** JSX for the Code container

### renderResponseView

Returns JSX for (or not for) the Response container given the current props

Returns **any** JSX for the Response container

## Feedback

**Extends Component**

Component that displays a feedback modal after user submits an answer.

## Hint

**Extends Component**

Component displays a hint at code editor's last cursor position.

## Code

**Extends Component**

The Code component contains the code view in the assessment problem

**Parameters**

-   `props` **Props** 

### componentDidMount

When component renders, set cursor to (0, 0)

### componentWillReceiveProps

Updates the code state when a new code prop is received

**Parameters**

-   `nextProps` **Props** the new prop object being received

### resetCursor

Resets the cursor position to (0, 0)

### handleThemeChange

Handles the dark/light checkbox toggle event.

### handleSelect

Stores highlighted text from text area in component state: highlighted.

**Parameters**

-   `e` **any** 

### handleReset

Resets both the code state and answer state.

### handleHintRequest

Sets hint position to the line of the last cursor position within Ace.
TODO: Fix positioning

### renderAce

Renders Ace with preferred options.
 Handles editable/non-editable state for code view.

Returns **any** JSX for the CodeMirror component

## Response

**Extends Component**

The Response component contains the response section in the assessment problem

### renderResponse

Returns JSX based on the response type

Returns **any** JSX for a type of response (MultipleChoice, ShortResponse)

## MultipleChoice

**Extends Component**

The MultipleChoice component represents multiple choice answer selection

## Choice

**Extends Component**

The Choice component represents a choice in a multiple choice exercise

## ShortResponse

**Extends Component**

The ShortResponse component renders short response exercise type

**Parameters**

-   `props` **Props** 

## SurveyView

**Extends Component**

**Parameters**

-   `props` **Props** 

### handleUpdate

When SurveyScale clicked, updates value in corresponding array.

**Parameters**

-   `ind` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `val` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### fillAll

Dev tool to quickly fill survey.

### fillAllUniform

Another dev tool.

**Parameters**

-   `ind` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 
-   `val` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### renderChoices

Renders each choice as a survey field.

**Parameters**

-   `choices` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

## Submit

**Extends Component**

The Submit component represents a button to submit an answer

### renderSubmitButton

Determines whether the submit button is clickable and returns JSX.

Returns **XML** 

## ConceptSelection

**Extends Component**

The ShortResponse component renders short response exercise type

**Parameters**

-   `props` **Props** 

### render

Wow modularity!

## Unorganized

Everything below here is auto-generated documentation that hasn't been
sorted yet.

