/**
 * Models student knowledge of each concept.
 * @class
 */

import {conceptInventory} from '../backend/Concepts.js';

export const masteryModel = [
  {
    concept: conceptInventory[0],
    type:
      {
        read: true,
        write: false
      }
  },
  {
    concept: conceptInventory[1],
    type:
      {
        read: false,
        write: false
      }
  }
]