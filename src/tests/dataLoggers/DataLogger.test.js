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

  it('addData timestamps rough value correctly', () => {
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
  })
})