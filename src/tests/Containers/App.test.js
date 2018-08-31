import App from '../../ui/koconut/containers/App';
import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {MemoryRouter} from 'react-router';
// configure enzyme to work with React version 16
Enzyme.configure({ adapter: new Adapter() });

// mocking firebase functions to make sure things are called correctly
const firebase = {
  auth: () => firebaseAuth(),
  database: () => firebaseDatabase()
}

const firebaseDatabase = jest.fn().mockImplementation(() => {
  return {
    ref: (a) => {return {set: () => {return "set"}}}
  }
})
const firebaseAuth = jest.fn().mockImplementation(() => {
  return {
    onAuthStateChanged: () => onAuthStateChanged(),
    currentUser: {uid: 'asdf'}
  };
});

const onAuthStateChanged = jest.fn().mockImplementation((fbUser) => {
  return () => stopWatchingAuthCallback();
});

const stopWatchingAuthCallback = jest.fn().mockImplementation(() => {
  return null;
});

describe('<App /> container', () => {
  it('Mounts and unmounts correctly', () => {
    const wrapper = mount(<MemoryRouter initialEntries={['/']}>
      <App firebase={firebase}/>
      </MemoryRouter>);

    // on mount, firebase authorization should be checked
    expect(firebaseAuth.mock.calls.length).toBe(1);
    expect(onAuthStateChanged.mock.calls.length).toBe(1);
    
    wrapper.unmount();
  });

  it('display state at beginning is LOAD', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    expect(wrapper.state('display')).toBe('LOAD');
    wrapper.unmount();
  });

  it('getInstruction sets state correctly', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    const concept = "abc";
    const instructionType = "READ";
    const displayType = wrapper.instance().returnDisplayTypes();

    wrapper.instance().getInstruction(concept, instructionType);
    expect(wrapper.state().currentConcept).toBe(concept);
    expect(wrapper.state().instructionType).toBe(instructionType);
    expect(wrapper.state().display).toBe(displayType.instruct);
    expect(wrapper.state().error).toBe(false);

    const concept2 = "xyz";
    const instructionType2 = "WRITE";

    wrapper.instance().getInstruction(concept2, instructionType);
    expect(wrapper.state().currentConcept).toBe(concept2);
    expect(wrapper.state().instructionType).toBe(instructionType);
    expect(wrapper.state().display).toBe(displayType.instruct);
    expect(wrapper.state().error).toBe(false);

    wrapper.unmount();
  });

  it('generateExercise sets the correct `no excercise` errors and runs as expected', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    const generatorEmpty = {
      getExercisesByTypeAndConcept: () => getEx1()
    }
    let getEx1 = jest.fn().mockImplementation(() => {
      return [];
    });

    const generatorFilled = {
      getExercisesByTypeAndConcept: () => getEx2()
    }
    let getEx2 = jest.fn().mockImplementation(() => {
      return [1,2,3];
    });

    const displayType = wrapper.instance().returnDisplayTypes();

    expect(wrapper.state().counter).toBe(0);
    expect(wrapper.state().exerciseType).toBe('');
    expect(wrapper.state().currentConcept).toBe(null);
    expect(wrapper.state().errorMessage).toBe('');
    const generateExercise = jest.spyOn(wrapper.instance(), 'generateExercise');
    expect(generateExercise).toHaveBeenCalledTimes(0);
    const switchToWorldView = jest.spyOn(wrapper.instance(), 'switchToWorldView');
    expect(switchToWorldView).toHaveBeenCalledTimes(0);


    const concept = "abc";
    const exerciseType = "def";
    wrapper.instance().generateExercise(concept, exerciseType, generatorEmpty);
    expect(generateExercise).toHaveBeenCalledTimes(1);
    expect(wrapper.state().error).toBe(true);
    expect(wrapper.state().errorMessage).toBe('Sorry, there are no exercises available for this concept right now.');
    wrapper.setState({counter: 3});
    wrapper.instance().generateExercise(concept, exerciseType, generatorFilled);
    expect(generateExercise).toHaveBeenCalledTimes(2);
    expect(wrapper.state().error).toBe(true);
    expect(wrapper.state().errorMessage).toBe('Sorry, there are no exercises available for this concept right now.');
    wrapper.setState({counter: 2});
    wrapper.instance().generateExercise(concept, exerciseType, generatorFilled);
    expect(generateExercise).toHaveBeenCalledTimes(3);

    wrapper.unmount();
  });

  it('getInstruction sets state correctly', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const getInstruction = jest.spyOn(wrapper.instance(), 'getInstruction');
    expect(getInstruction).toHaveBeenCalledTimes(0);

    const displayType = wrapper.instance().returnDisplayTypes();

    const concept = "abc";
    const instructionType = "def";
    wrapper.instance().getInstruction(concept, instructionType);
    expect(getInstruction).toHaveBeenCalledTimes(1);

    expect(wrapper.state().currentConcept).toBe(concept);
    expect(wrapper.state().instructionType).toBe(instructionType);
    expect(wrapper.state().display).toBe(displayType.instruct);
    expect(wrapper.state().error).toBe(false);
    
    wrapper.unmount();
  });

  it('setInstructionViewError executes intended behavior', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const switchToWorldView = jest.spyOn(wrapper.instance(), 'switchToWorldView');
    expect(switchToWorldView).toHaveBeenCalledTimes(0);
    const setInstructionViewError = jest.spyOn(wrapper.instance(), 'setInstructionViewError');
    expect(setInstructionViewError).toHaveBeenCalledTimes(0);

    wrapper.instance().setInstructionViewError();
    expect(setInstructionViewError).toHaveBeenCalledTimes(1);
    expect(switchToWorldView).toHaveBeenCalledTimes(1);
    expect(wrapper.state().error).toBe(true);
    expect(wrapper.state().errorMessage).toBe('Looks like there are no instructions on this concept right now. Please come back later!');
		

    wrapper.unmount();
  });

  it('resetError resets error', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    wrapper.setState({error: true});
    expect(wrapper.state().error).toBe(true);
    const resetError = jest.spyOn(wrapper.instance(), 'resetError');
    expect(resetError).toHaveBeenCalledTimes(0);
    wrapper.instance().resetError();
    expect(resetError).toHaveBeenCalledTimes(1);
    expect(wrapper.state().error).toBe(false);
    wrapper.instance().resetError();
    expect(resetError).toHaveBeenCalledTimes(2);
    expect(wrapper.state().error).toBe(false);
    wrapper.unmount();
  });

  it('getConcepts executes intended behavior', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const getConcepts = jest.spyOn(wrapper.instance(), 'getConcepts');
    expect(getConcepts).toHaveBeenCalledTimes(0);
    wrapper.setState({conceptOptions: 6, currentConcept: 'abc'});
    expect(wrapper.state().conceptOptions).toBe(6);
    expect(wrapper.state().currentConcept).toBe('abc');

    const generator = {
      getConceptsRelativeTo: (c) => get1(c),
      getConcepts: (c) => get2(c)
    }
    let get1 = jest.fn().mockImplementation((c) => {
      return c;
    });
    let get2 = jest.fn().mockImplementation((c) => {
      return c;
    });

    const call1 = wrapper.instance().getConcepts(generator);
    expect(call1).toBe('abc');
    expect(get1).toHaveBeenCalledTimes(1);
    expect(get2).toHaveBeenCalledTimes(0);

    wrapper.setState({currentConcept: null});
    const call2 = wrapper.instance().getConcepts(generator);
    expect(call2).toBe(6);
    expect(get1).toHaveBeenCalledTimes(1);
    expect(get2).toHaveBeenCalledTimes(1);

    wrapper.setState({currentConcept: undefined});
    const call3 = wrapper.instance().getConcepts(generator);
    expect(call3).toBe(6);
    expect(get1).toHaveBeenCalledTimes(1);
    expect(get2).toHaveBeenCalledTimes(2);

    wrapper.unmount();
  });

  it('checkAnswer works for a few regular questions and sets timesGotQuestionWrong state correctly', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const cString = 'correct';
    const icString = 'incorrect';

    const exercise = {
      questions: [
        {
          answer: "a"
        },
        {
          answer: "b"
        },
        {
          answer: "c"
        }
      ]
    };
    
    let answer = ["a"];
    let questionIndex = 0;
    let questionType = "reg";
    wrapper.setState({exercise})
    let returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([cString]);
    expect(wrapper.state().timesGotQuestionWrong).toEqual([0]);
    
    answer = ["b", null, "a"];
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([icString]);
    expect(wrapper.state().timesGotQuestionWrong).toEqual([1]);

    questionIndex = 2;
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([icString, null || undefined, icString]);
    expect(wrapper.state().timesGotQuestionWrong).toEqual([1,null || undefined, 1]);

    questionIndex = 1;
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([icString, icString, icString]);

    answer = ["a", "b", "b"];
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([icString, cString, icString]);

    questionIndex = 0;
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([cString, cString, icString]);

    questionIndex = 2;
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([cString, cString, icString]);

    answer = ["a", "b", "c"];
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([cString, cString, cString]);

    wrapper.unmount();
  });

  it('checkAnswer test regular type question with table typing', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const exercise = {
      questions: [
        {
          answer: "a"
        },
        {
          answer: "b"
        },
        {
          answer: "c"
        }
      ]
    };
    
    let answer = ["a"];
    let questionIndex = 0;
    let questionType = "table";
    wrapper.setState({exercise});
    try {
      let returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    } catch(e) {
      // do nothing, expected behavior
    }

    wrapper.unmount();
  });

  it('checkAnswer works for table types basic', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const cString = 'correct';
    const icString = 'incorrect';
    const exercise = {
      questions: [
        {
          colNames: [ "Code", "Data Type (choose one)", "Result", "Result 2" ],
          data: [
            {
                "answer": "", "prompt": "5.0 + 2", "type": ""
            },
            {
                "answer": "integer", "choices": [ "integer", "float" ],
                "type": "multipleChoice"
            },
            {
                "answer": "abc", "type": "fillBlank"
            },
            {
                "answer": "abc", "type": "fillBlank"
            },
            {
                "answer": "", "prompt": "5.0 + 2", "type": ""
            },
            {
                "answer": "aaa",  "choices": [ "aaa", "bbb", "ccc", "ddd" ],
                "type": "multipleChoice"
            },
            {
                "answer": "fdsa", "type": "fillBlank"
            },
            {
                "answer": "fdsa", "type": "fillBlank"
            }
          ]
        }
      ]
    };

    let answer = [[[null, "float", "ab", "abc"], [null, "aaa", "fds", "fdsa"]]];
    let questionIndex = 0;
    let questionType = "table";
    wrapper.setState({exercise});
    let returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([[[null, icString, icString, cString],
                              [null, cString, icString, cString]]]);
    answer = [[[null, "integer", "abc", "abc"], [null, "aaa", "fdsa", "fdsa"]]];
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([[[null, cString, cString, cString],
                              [null, cString, cString, cString]]]);
    wrapper.unmount();
  });

  it('checkAnswer works for large (5x11) table', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const cString = 'correct';
    const icString = 'incorrect';
    let exercise = {
      questions: [{
        colNames: [],
        data: []
      }]
    };

    for (let i = 0; i < 55; i++) {
      if(i < 11) {
        exercise.questions[0].colNames.push(i + "");
      }
      if(i%11 == 0) {
        let obj = {
          answer: "", prompt: i + "", type: ""
        }
        exercise.questions[0].data.push(obj);
      } else {
        let obj = {
          answer: i + "", type: "fillBlank"
        }
        exercise.questions[0].data.push(obj);
      }
    }

    let answer = [[]];
    let tempAnswer = [];
    let feedback = [[]];
    let tempFeedback = [];
    for(let i = 0; i < 55; i++) {
      if(i%11 == 0) {
        if(tempAnswer.length !== 0 && tempFeedback.length !== 0) {
          answer[0].push(tempAnswer);
          tempAnswer = [];
          feedback[0].push(tempFeedback);
          tempFeedback = [];
        }
        tempAnswer.push(null);
        tempFeedback.push(null);
      } else {
        tempAnswer.push(i + "");
        tempFeedback.push(cString);
      }
    }
    answer[0].push(tempAnswer);
    feedback[0].push(tempFeedback);
    let questionIndex = 0;
    let questionType = "table";
    wrapper.setState({exercise});
    let returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual(feedback);
    wrapper.unmount();
  });

  it('checkAnswer works for checkboxQuestions basic', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const exercise = {
      questions: [
        {
          answer: ["a", "b"],
          choices: ["a", "b", "c", "d", "e"]
        }
      ]
    };

    const cString = 'correct';
    const icString = 'incorrect';
    let answer = [["a", "b", "c"]];
    let questionIndex = 0;
    let questionType = "checkboxQuestion";
    wrapper.setState({exercise});
    let returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([icString]);
    answer = [["a", "b"]];
    returns = wrapper.instance().checkAnswer(answer, questionIndex, questionType, -1);
    expect(returns).toEqual([cString]);
    wrapper.unmount();
  });

  it('resetFeedback sets state correctly', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    
    expect(wrapper.state().feedback).toEqual([]);
    expect(wrapper.state().followupFeedback).toEqual([]);
    expect(wrapper.state().timesGotQuestionWrong).toEqual([]);
    expect(wrapper.state().followupTimesGotQuestionWrong).toEqual([]);
    let initState = wrapper.state();

    const feedback = ["a"];
    const followupFeedback = ["a"];
    const timesGotQuestionWrong = ["a"];
    const followupTimesGotQuestionWrong = ["a"];
    wrapper.setState({
      feedback, followupFeedback, timesGotQuestionWrong, followupTimesGotQuestionWrong
    });

    expect(wrapper.state().feedback).toEqual(feedback);
    expect(wrapper.state().followupFeedback).toEqual(followupFeedback);
    expect(wrapper.state().timesGotQuestionWrong).toEqual(timesGotQuestionWrong);
    expect(wrapper.state().followupTimesGotQuestionWrong).toEqual(followupTimesGotQuestionWrong);
    expect(wrapper.state()).not.toEqual(initState);

    wrapper.instance().resetFeedback();
    expect(wrapper.state().feedback).toEqual([]);
    expect(wrapper.state().followupFeedback).toEqual([]);
    expect(wrapper.state().timesGotQuestionWrong).toEqual([]);
    expect(wrapper.state().followupTimesGotQuestionWrong).toEqual([]);
    expect(wrapper.state()).toEqual(initState);
    wrapper.unmount();
  });

  it('submitConcept updates state', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    wrapper.instance().submitConcept("abc");
    expect(wrapper.state().concept).toBe("abc");
    expect(wrapper.state().counter).toBe(0);
    wrapper.unmount();
  });

  it('submitConcept generates exercise as well', () => {
    const wrapper = shallow(<App firebase={firebase}/>);
    const generateExercise = jest.spyOn(wrapper.instance(), 'generateExercise');
    wrapper.instance().submitConcept("abc");
    expect(wrapper.state().concept).toBe("abc");
    expect(wrapper.state().counter).toBe(0);
    expect(generateExercise).toHaveBeenCalledTimes(1);
    expect(generateExercise.mock.calls[0][0]).toBe('abc');
    expect(generateExercise.mock.calls[0][1]).toBe('');
    wrapper.unmount();
  });
  it('stub test', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    wrapper.unmount();
  });
  it('stub test', () => {
    const wrapper = shallow(<App firebase={firebase}/>);

    wrapper.unmount();
  });
});