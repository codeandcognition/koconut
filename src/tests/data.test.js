// To test
import conceptInventory from '../data/ConceptMap';
import {sep, op, quote, keyword, g} from '../data/ConceptAbbreviations';

function toCheck(c) {
  return Object.values(g).includes(c) || Object.values(keyword).includes(c);
}

test('ConceptMap parents consistency', () => {
  conceptInventory.forEach((concept) => {
    concept.dependencies.filter(c => toCheck(c)).forEach((dependency) => {
      let parents = conceptInventory.filter(
          item => item.name === dependency)[0].parents;
      if(!parents.includes(concept.name)) console.log(`${dependency} missing ${concept.name}`);
      expect(parents).toContain(concept.name);
    });
  });
});

test('ConceptMap dependencies consistency', () => {
  conceptInventory.forEach((concept) => {
    concept.parents.filter(c => toCheck(c)).forEach((parent) => {
      let dependencies = conceptInventory.filter(
          item => item.name === parent)[0].dependencies;
      if(!dependencies.includes(concept.name)) console.log(`${parent} missing ${concept.name}`);
      expect(dependencies).toContain(concept.name);
    });
  });
});