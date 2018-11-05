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
    expect(() => {d.addData('MOUSECLICK', 'M1', 'asdfsasdf', {row: 1, col: 2})}).toThrow();
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
  
})