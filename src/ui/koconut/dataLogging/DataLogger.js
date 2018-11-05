export default class DataLogger {
  constructor(type) {
    this.data = [];
    this.type = type;
  }

  /** 
   * pushData pushes a data object to the internal data array that will be
   * pushed to firebase
   * @param {string} event a string of either "MOUSECLICK" or "KEYBOARD"
   * @param {string} keyPressed A string indicating which button was pressed from either the mouse or keyboard
   * @param {string} textContent Content inside the notepad or the coder
   * @param {object} textPosition Position of the cursor of the text. Has fields `row` and `col` coming from AceEditor
   * @param {?number} selectedAnswer Optional parameter. Required only for READ type questions. -1 if not answered, 0-n if answered
   */
  addData(event, keyPressed, textContent, textPosition, selectedAnswer) {
    let timestamp = Date.now();
    if(this.type === "READ" && selectedAnswer === undefined) {
      throw new Error('selectedAnswer not provided');
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
    this.type = newType;
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
   * @param {string} userId Must provide a user Id for firebase path
   * @param {string} exerciseId Must provide an exercise Id corresponding with this current exercise
   * @param {object} firebase Must dependency inject firebase
   */
  sendDataToFirebase(userId, exerciseId, firebase) {
    // do some stuff
    this._clearData();
  }
}