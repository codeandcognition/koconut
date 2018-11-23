/**
 * DataLogger class keeps track of a question log (one at a time)
 * You must clear it manually after every question
 * @class
 */
export default class DataLogger {
  /**
   * constructor for DataLogger class
   * Sets up a data array and type.
   * @param {string} type the type of the datalogger
   * @throws {error} if type is not READ or WRITE
   */
  constructor(type) {
    this._checkTypes(type)
    this.data = [];
    this.type = type;
  }

  /** 
   * pushData pushes a data object to the internal data array that will be
   * pushed to firebase
   * @param {string} event a string of either "MOUSECLICK" or "KEYBOARD"
   * @param {string} keyPressed A string indicating which button was pressed from either the mouse or keyboard
   * @param {?string} textContent Content inside the notepad or the coder, default value will be the most recent logs' or empty string if log is empty
   * @param {?object} textPosition Position of the cursor of the text. Has fields `row` and `col` coming from AceEditor, default value will be -1, -1
   *                                Has an optional `range` field which has to do with when the user may highlight things.
   * @param {?number} selectedAnswer Optional parameter. Required only for READ type questions. -1 if not answered, 0-n if answered
   * @throws {error} selectedAnswer not provided if this.type is "READ" and selectedAnswer parameter not provided
   */
  addData({event, keyPressed, textContent, textPosition, selectedAnswer}) {
    let timestamp = Date.now();
    if(this.type === "READ" && selectedAnswer === undefined) {
      selectedAnswer = -1;
    }

    // textContent has to not be empty string, but still be falsey
    // This means even if emptied out, it will be updated correctly.
    if(textContent !== "" && !textContent) {
      if(this.data.length === 0) {
        textContent = ""
      } else {
        textContent = this.data[this.data.length - 1].textContent;
      }
    }

    // if textPosition isn't given, it means user is clicked out of the aceeditor
    if(!textPosition) {
      textPosition = {row: -1, col: -1}
    }

    let dataObject = {event, keyPressed, textContent, textPosition, timestamp};
    if(this.type === "READ") {
      dataObject = {...dataObject, selectedAnswer};
    }

    this.data.push(dataObject);
  }

  /**
   * getData returns the data
   * @return data
   */
  getData() {
    return this.data;
  }

  /**
   * updateType updates the current type of the DataLogger. This is necessary when changing to a new execise
   * because exercise doesn't re-construct.
   * @param {string} newType "READ" or "WRITE"
   */
  updateType(newType) {
    this._checkTypes(newType);
    this.type = newType;
  }

  /**
   * checkTypes checks to see if the type is valid as a READ type or WRITE type
   * @param {string} type type to check
   * @throws {error} if type is not READ or WRITE
   */
  _checkTypes(type) {
    if(!(type === "READ" || type === "WRITE")) {
      throw new Error('Invalid type provided');
    }
  }

  /**
   * clearData clears the data in the internal data array
   * @private
   */
  _clearData() {
    this.data = [];
  }

  /**
   * sendDataToFirebase will upload the data object to firebase based on the user path
   * Requiring the user to enter userId and exerciseId makes resetting easier.
   *
   * Automatically clears the data after pushing data to firebase
   */
  sendDataToFirebase() {
    // do some stuff
    let {userId, exerciseId, firebase} = this;
    if(!firebase || !exerciseId || !userId) {
      throw new Error(`You have not bound one of userId, exerciseId, or Firebase to the data logger
      
      Firebase: ${firebase},
      ExerciseId: ${exerciseId},
      UserID: ${userId}

      Use \`.bindInformation({firebase, exerciseId, userId})\` to bind all three at once
      `);
    }
    const objectToPush = {
      ExerciseType: this.type,
      ExerciseId: exerciseId,
      DataLog: this.data
    };
    // firebase.database().ref(`/Users/${userId}/Data/LogData`).push(objectToPush);
    this._clearData();
    console.log(userId, exerciseId, firebase, this.getData())
  }

  /**
   * @param {string} userId Must provide a user Id for firebase path
   */
  bindUserId(userId) {
    this.userId = userId;
  }


  /**
   * @param {string} exerciseId Must provide an exercise Id corresponding with this current exercise
   */
  bindExerciseId(exerciseId) {
    this.exerciseId = exerciseId;
  }

  /**
   * @param {object} firebase Must dependency inject firebase
   */
  bindFirebase(firebase) {
    this.firebase = firebase;
  }

  /**
   * bindInformation is a combination of all three binds that just lets you do
   * it all at once
   */
  bindInformation({userId, exerciseId, firebase}) {
    if(userId) {
      this.bindUserId(userId);
    }
    if(exerciseId) {
      this.bindExerciseId(exerciseId);
    }
    if(firebase) {
      this.bindFirebase(firebase);
    }
  }
}