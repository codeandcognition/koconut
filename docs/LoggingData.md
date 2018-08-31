# Logging User Data

We log user data. The user data is linked to the user's UID stored in Firebase. When analyzing the data exported as JSON, they will effectively be completely anonymous.

## What data we log per user id
* Session events
  * type: start || end
  * timestamp: Firebase.database.ServerValue.TIMESTAMP
* Answer submission
  * timestamp: Firebase.database.ServerValue.TIMESTAMP
  * questionid: {{questionid}}
  * response: response (can be 2d array, array, or string)
  * correctness: 'correct' || 'incorrect' (no 2d array for table, just overall correctness)
* New page visit
  * timestamp: Firebase.database.ServerValue.TIMESTAMP
  * pageType: 'instruction' || 'exercise' || 'world'
  * pageNumber: // page of instruction OR question number on exercise OR nothing for the respective pageType.
