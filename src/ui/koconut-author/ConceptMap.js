/*
Currently standalone file. Must confirm the mapping before using
 */

const sep = { left_paren: "(", right_paren: ")", left_curl: "{", right_curl: "}",
	left_sqr: "[", right_sqr: "]", semicolon: ";", comma: ",", dot: ".",
	triple_dot: "...", at: "@", double_colon: "::"
};

const op = { assign: "=", greater: ">", lesser: "<", not: "!", equality: "==",
	greater_equality: ">=", lesser_equality: ">=", not_equal: "!=", and: "&&",
	or: "||", incr: "++", decr: "--", add: "+", sub: "-", mult: "*", div: "/",
	add_assign: "+=", sub_assign: "-=", mult_assign: "*=", div_assign: "/="
};

const quote = { single: "'", double: "\"" };

const keyword = { new: "new", true: "true", false: "false", if: "if", else: "else",
	for: "for", do: "do", while: "while", continue: "continue", return: "return",
	null: "null", this: "this", super: "super",
};

const g = {
	howCodeRuns: "howCodeRuns",
	dataTypes: "dataTypes",
	printStatements: "printStatements",
	variables: "variables",
	arithmeticOperators: "arithmeticOperators",
	relationalOperators: "relationalOperators",
	variableSwap: "variableSwap",
	digitProcessing: "digitProcessing",
	floatEquality: "floatEquality",
	conditionals: "conditionals",
	findMaxMin: "findMaxMin"
}

const t = {
	semantic: "semantic",
	template: "template",
	onboarding: "onboarding"
}


export const conceptInventory =
 {
	[g.howCodeRuns]: {
		dependencies: [],
		parents: [g.dataTypes],
		explanations: {
			name: "How Code Runs",
			definition: "this is a test",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.onboarding
	},
	[g.dataTypes]: {
		dependencies: [g.howCodeRuns],
		parents: [g.printStatements, g.variables, g.arithmeticOperators, g.relationalOperators],
		explanations: {
			name: "Data Types",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.semantic
	},
	[g.printStatements]: {
		dependencies: [g.dataTypes],
		parents: [],
		explanations: {
			name: "Print Statements",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.semantic
	},
	[g.variables]: {
		dependencies: [g.dataTypes],
		parents: [g.variableSwap, g.digitProcessing],
		explanations: {
			name: "Variables",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.semantic
	},
	[g.arithmeticOperators]: {
		dependencies: [g.dataTypes],
		parents: [g.digitProcessing, g.floatEquality],
		explanations: {
			name: "Arithmetic Operators",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.semantic
	},
	[g.relationalOperators]: {
		dependencies: [g.dataTypes],
		parents: [g.floatEquality, g.conditionals],
		explanations: {
			name: "Relational Operators",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.semantic
	},
	[g.variableSwap]: {
		dependencies: [g.variables],
		parents: [],
		explanations: {
			name: "Variable Swap",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.template
	},
	[g.digitProcessing]: {
		dependencies: [g.variables, g.arithmeticOperators],
		parents: [],
		explanations: {
			name: "Digit Processing",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.template
	},
	[g.floatEquality]: {
		dependencies: [g.arithmeticOperators, g.relationalOperators],
		parents: [],
		explanations: {
			name: "Float Equality",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.template
	},
	[g.conditionals]: {
		dependencies: [g.relationalOperators],
		parents: [g.findMaxMin],
		explanations: {
			name: "Conditionals",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.semantic
	},
	[g.findMaxMin]: {
		dependencies: [g.conditionals],
		parents: [],
		explanations: {
			name: "Find Max/Min",
			definition: "",
			examples: [],
			future: []
		},
		should_teach: true,
		container: true,
		type: t.template
	},
};

export default conceptInventory;