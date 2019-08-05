// conditions for study
const CONDITIONS = {
  C1: "C1", // system controlled condition where recommendations not shown
  E1: "E1", // mixed-initiative condition w/ recommendations and agency
  C2: "C2", // system controlled condition w/ no user agency
  INVALID: "INVALID"
}

const REC_PREFIX = "Based on how you've been doing on exercises";

const REC_INFO = {
    "review": {
        "text": `${REC_PREFIX}, this will help you review concepts you know`,
        "icon": "fa-undo"
    },
    "continue": {
        "text": `${REC_PREFIX}, this will help you continue what you've been learning`,
        "icon": "fa-play-circle"
    },
    "jump": {
        "text": `${REC_PREFIX}, this will challenge you; but you're ready!`,
        "icon": "fa-redo"
    }
};

export {CONDITIONS, REC_INFO};