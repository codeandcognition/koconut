// @flow

export const instructionType = {
  read: 'READ',
  write: 'WRITE'
};

export type Instruction = {
  id: number,
  name: string,
  concept: string,
  type: string,
  content: string
}

export const stubInstruction: {} = {
  id: 0,
  name: "stub instruction",
  concept: 'integerLiteral',
  type: instructionType.read,
  content: "## header 2 in markup\n"
}

export let exampleInstructions1 = [
  {
    'id': 1,
    'name': 'example 1',
    'concept': 'returnStatement',
    'type':'READ',
    'content':'![image](imageLink)'
  },
  {
    'id': 2,
    'name': 'example 2',
    'concept': 'assignmentOperator',
    'type':'WRITE',
    'content':'[text](link)'
  },
  {
    'id': 3,
    'name': 'example 3',
    'concept': 'conditionalAndExpression',
    'type':'READ',
    'content':'test \n * test \n * test'
  },
];