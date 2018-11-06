import DataLogger from '../../ui/koconut/dataLogging/DataLogger';

describe('DataLogger tests', () => {

  // 'MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2}, 1
  it('addData adds data to internal structure', () => {
    let d = new DataLogger('READ');
    expect(d.getData().length).toBe(0);
    d.addData('MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2}, 1);
    expect(d.getData().length).toBe(1);
  });

  it('addData handles large amounts of additions', () => {
    let d = new DataLogger('READ');
    expect(d.getData().length).toBe(0);
    for(let i = 0; i < 100000; i++) {
      d.addData('MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2}, 1);
    }
    expect(d.getData().length).toBe(100000);    
  });

  it('addData throws an error if selectedAnswer is not provided', () => {
    let d = new DataLogger('READ');
    let paramsWithoutSelectedAnswer = ['MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2}];
    expect(() => {d.addData(...paramsWithoutSelectedAnswer)}).toThrow();
  });

  it('addData works for WRITE types', () => {
    let d = new DataLogger('WRITE');
    expect(d.getData().length).toBe(0);
    d.addData('MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2});
    expect(d.getData().length).toBe(1);
  });

  it('addData doesn\'t keep track of selectedAnswer for WRITE types', () => {
    let d = new DataLogger('WRITE');
    expect(d.getData().length).toBe(0);
    d.addData('MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2}, 1);
    expect(d.getData().length).toBe(1);
    expect(d.getData()[0].selectedAnswer).toBeUndefined();
  });

  it('addData timestamps value roughly correct', () => {
    const event = 'MOUSECLICK';
    const keyPressed = 'M1';
    const textContent = 'asdfasdf';
    const textPosition = {row: 1, col: 2};
    const selectedAnswer = 1;
    let d = new DataLogger('READ');    
    const timestamp1 = Date.now();
    d.addData(event, keyPressed, textContent, textPosition, selectedAnswer);
    const timestamp2 = Date.now();

    let e = d.getData()[0];

    expect(e.event).toBe(event);
    expect(e.keyPressed).toBe(keyPressed);
    expect(e.textContent).toBe(textContent);
    expect(e.textPosition).toEqual(textPosition);
    expect(e.timestamp).toBeGreaterThanOrEqual(timestamp1);
    expect(e.timestamp).toBeLessThanOrEqual(timestamp2);
  });

  it('updateType updates the type correctly', () => {
    let d = new DataLogger('READ');    
    expect(d.type).toBe('READ');
    d.updateType('WRITE');
    expect(d.type).toBe('WRITE');
  });

  it('updateType throws an error correctly with invalid input', () => {
    let d = new DataLogger('READ');    
    expect(d.type).toBe('READ');
    expect(() => d.updateType('WRITEA')).toThrow();
  });

  it('updateType doesn\'t update with invalid input', () => {
    let d = new DataLogger('READ');    
    expect(d.type).toBe('READ');
    expect(() => d.updateType('WRITEA')).toThrow();
    expect(d.type).toBe('READ');
  });

  it('sendDataToFirebase sends data to the correct link', () => {
    const event = 'MOUSECLICK';
    const keyPressed = 'M1';
    const textContent = 'asdfasdf';
    const textPosition = {row: 1, col: 2};
    const selectedAnswer = 1;

        



    let d = new DataLogger('READ');    
    d.addData(event, keyPressed, textContent, textPosition, selectedAnswer);
    const push = jest.fn().mockImplementation((object) => jest.fn().mockImplementation((object) => {
      return object;
    }));

    const ref = jest.fn().mockImplementation((path) => {
      return {
        push
      }
    })

    const database = jest.fn().mockImplementation(() => {
      return {
        ref
      }
    });

    // create firebase mock
    const mockFirebase = {
      database
    }
    const fakeUserId = "abc123";
    const fakeExerciseId = "exercise123abc";

    expect(push.mock.calls.length).toBe(0);
    expect(ref.mock.calls.length).toBe(0);
    expect(database.mock.calls.length).toBe(0);
    const timestamp1 = Date.now();
    d.sendDataToFirebase(fakeUserId, fakeExerciseId, mockFirebase);
    const timestamp2 = Date.now();
    expect(push.mock.calls.length).toBe(1);
    expect(ref.mock.calls.length).toBe(1);
    expect(database.mock.calls.length).toBe(1);

    let refParam = ref.mock.calls[0][0];
    expect(refParam).toBe(`/Users/${fakeUserId}/Data/LogData`);

    let e = push.mock.calls[0][0].DataLog[0];
    
    expect(e.event).toBe(event);
    expect(e.keyPressed).toBe(keyPressed);
    expect(e.textContent).toBe(textContent);
    expect(e.textPosition).toEqual(textPosition);
    expect(e.timestamp).toBeGreaterThanOrEqual(timestamp1);
    expect(e.timestamp).toBeLessThanOrEqual(timestamp2);
  });
})