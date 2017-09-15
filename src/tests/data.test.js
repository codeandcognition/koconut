// To test
import conceptInventory from '../data/ConceptMap';
import {sep, op, quote, keyword, g} from '../data/ConceptAbbreviations';
import _ from 'lodash';

function toCheck(c) {
  return Object.values(g).includes(c) || Object.values(keyword).includes(c);
}

test('ConceptMap parents consistency', () => {
  _.forEach(conceptInventory, (concept, name) => {
    concept.dependencies.filter(c => toCheck(c)).forEach((dependency) => {
      if(!conceptInventory[dependency].parents.includes(name)) console.log(`${dependency} missing ${name}`);
      expect(conceptInventory[dependency].parents).toContain(name);
    });
  });
});

test('ConceptMap dependencies consistency', () => {
  _.forEach(conceptInventory, (concept, name) => {
    concept.parents.filter(c => toCheck(c)).forEach((parent) => {
      if(!conceptInventory[parent].dependencies.includes(name)) console.log(`${parent} missing ${name}`);
      expect(conceptInventory[parent].dependencies).toContain(name);
    });
  });
});
