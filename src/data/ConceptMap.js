/*
Currently standalone file. Must confirm the mapping before using
 */

// const sep = { left_paren: "(", right_paren: ")", left_curl: "{", right_curl: "}",
// 	left_sqr: "[", right_sqr: "]", semicolon: ";", comma: ",", dot: ".",
// 	triple_dot: "...", at: "@", double_colon: "::"
// };

// const op = { assign: "=", greater: ">", lesser: "<", not: "!", equality: "==",
// 	greater_equality: ">=", lesser_equality: ">=", not_equal: "!=", and: "&&",
// 	or: "||", incr: "++", decr: "--", add: "+", sub: "-", mult: "*", div: "/",
// 	add_assign: "+=", sub_assign: "-=", mult_assign: "*=", div_assign: "/="
// };

// const quote = { single: "'", double: "\"" };

// const keyword = { new: "new", true: "true", false: "false", if: "if", else: "else",
// 	for: "for", do: "do", while: "while", continue: "continue", return: "return",
// 	null: "null", this: "this", super: "super",
// };

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
					definition: "Learn how a computer reads code!",
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
					definition: `Computers reason about different data types so they can be precise about their reasoning. This is the same kind of precision as in Math: adding two apples and three dogs wouldn't make sense. By having different data types, Python can help you avoid mistakes like this!\n\nTypes are different classifications for data. In Python, 3 common types of data are numbers, strings, and boolean.`,
					examples: [`integer = 1\nfloat = 1.0\nstring = "hello"\nboolean = True`],
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
					definition: "The print statement sends an output of values to your monitor.",
					examples: [`print('abc')\na = 123\nprint(a)`],
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
					definition: "We often want to store values of various data types and use them later. We do this using variables.",
					examples: [`abc = 123`],
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
					definition: "Much of the things we experience on computers (watching movies, using spreadsheets, etc.) involve arithmetic with numbers (integers and floats). Python offers arithmetic operators to help implement these behaviors.",
					examples: [`abc = 1 + 2 + 3\nx = abc % 2`],
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
					definition: `Relational operators test to determine if a given relationship is valid. The result in a boolean value of \`true\` if the relationship is in fact valid and \`false\` if the relationship is not valid.`,
					examples: [`a = 1\nb = 2\nprint(a != b and 3 < 4)`],
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
					definition: "A common task we want to do is swap the values in two variables so the result is that each variable stores the original value of the other variable. Because code runs one line at a time, there's no way to simultaneously swap variables.",
					examples: [`winner = "Abby"\nloser = "Julian"\nprev_winner = winner\nwinner = loser\nloser = prev_winner`],
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
					definition: "These days, we have use numeric passwords to secure many things, such as cell phones, debit cards, doorways, and user accounts. Verifying that a numeric password, such as the 4 digit personal identification number (PIN) of a debit card, is correct is critical to ensuring security.",
					examples: [`input = 123\nlast_digit = input % 10\ninput = input / 10\nsecond_digit = input % 10\ninput = input / 10\nfirst_digit = input % 10`],
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
					definition: "Computers make very precise calculations. This often a good thing, because we want precision if we are calculating things such as a satellite's trajectory around the earth where small changes can result in major differences. This precision can often result in some strange behavior though. ",
					examples: [`1.0 == 1.000000000000001 # False\n1.0 == 1.000000000000001 # True`],
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
					definition: "After determining the relationship between values with relational operators, we want to do different things based on different relationships. ",
					examples: [`if (cost <= 1.00):\n    print("buy the soda!")`],
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
					definition: "Checking a value then removing it from future checks and repeating this process with the remaining numbers is how we find the maximum or minimum number from multiple options.",
					examples: [`if (a > b and a > c):\n    print(a)\nelif (b > c):\n    print(b)\nelse:\n    print(c)`],
					future: []
				},
				should_teach: true,
				container: true,
				type: t.template
			},
		};

export default conceptInventory;