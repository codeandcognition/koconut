// @flow


type InstructConceptType = {
  READ: number[],
  WRITE: number[]
}
export type InstructionListType = Map<string, InstructConceptType>;

// add to this list?
export const InstructionList: {} = {
  "assignmentOperator" : {
    "READ": [2],
    "WRITE": []
  }
};

