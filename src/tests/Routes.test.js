import Routes from '../Routes';

describe('Routes file', () => {
  it('All routes are strings', () => {
    Object.keys(Routes).forEach(d => {
      expect(typeof(Routes[d])).toBe("string");
    })
  });

  it('All routes are preceded by a `/`', () => {
    Object.keys(Routes).forEach(d => {
      expect(Routes[d][0]).toBe("/");
    })
  })
})