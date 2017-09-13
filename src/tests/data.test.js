// To test
import conceptInventory from '../data/ConceptMap';

test('ConceptMap parents consistency', () => {
  conceptInventory.forEach((concept) => {
    concept.dependencies.forEach((dependency) => {
      expect(conceptInventory.filter(
          item => item.name === dependency)[0].parents).toContain(dependency);
    });
  });
});

test('ConceptMap dependencies consistency', () => {
  conceptInventory.forEach((concept) => {
    concept.parents.forEach((parent) => {
      expect(conceptInventory.filter(
          item => item.name === parent)[0].dependencies).toContain(parent);
    });
  });
});