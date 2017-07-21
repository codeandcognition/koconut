// @flow
/**
 * Models student knowledge of each concept.
 * @class
 */

import {conceptInventory} from '../backend/Concepts.js';

type conceptMastery = {
  concept: string,
  type:
    {
      read: boolean,
      write: boolean
    }
}

export const masteryModel: conceptMastery[] = [
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