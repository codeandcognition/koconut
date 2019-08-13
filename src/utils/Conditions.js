// conditions for study
const CONDITIONS = {
  C1: "C1", // system controlled condition where recommendations not shown
  E1: "E1", // mixed-initiative condition w/ recommendations and agency
  C2: "C2", // system controlled condition w/ no user agency
  INVALID: "INVALID"
};

const REC_ICONS = {
    review: 'fa-undo',
    continue: 'fa-play-circle',
    challenge: 'fa-redo'
};

const REC_TYPES = {
    review: "review",
    continue: "continue",
    challenge: "challenge"
};

const REC_RESPONSES = {
    0:  {
        read : false,
        know : false,
        parents_know : false,
        text : "You haven't read about this concept or practiced it, so try this exercise for a challenge!",
        type : REC_TYPES.challenge,
        icon : REC_ICONS[REC_TYPES.challenge]
    },
    1:  {
        read : false,
        know : false,
        parents_know : true,
        text : "You've practiced related concepts, but not yet this one. Try this exercise for a challenge!",
        type : REC_TYPES.challenge,
        icon : REC_ICONS[REC_TYPES.challenge]
    },
    10:  {
        read : false,
        know : true,
        parents_know : false,
        text : "You've practiced this concept already, so this exercise is review.",
        type : REC_TYPES.review,
        icon : REC_ICONS[REC_TYPES.review]
    },
    11:  {
        read : false,
        know : true,
        parents_know : true,
        text : "You've practiced this concept and related ones already, so this exercise is review.",
        type : REC_TYPES.review,
        icon : REC_ICONS[REC_TYPES.review]
    },    
    100:  {
        read : true,
        know : false,
        parents_know : false,
        text : "You've read about this concept, but haven't practiced it or related concepts. Do this exercise for a challenge!",
        type : REC_TYPES.challenge,
        icon : REC_ICONS[REC_TYPES.challenge]
    },
    101:  {
        read : true,
        know : false,
        parents_know : true,
        text : "You've read this concept and practiced related ones, so do this exercise to continue learning.",
        type : REC_TYPES.continue,
        icon : REC_ICONS[REC_TYPES.continue]
    },
    110:  {
        read : true,
        know : true,
        parents_know : false,
        text : "You've read and practiced this concept, so try this exercise to review what you learned.",
        type : REC_TYPES.review,
        icon : REC_ICONS[REC_TYPES.review]
    },
    111:  {
        read : true,
        know : true,
        parents_know : true,
        text : "You've read and practied this and related concepts, so this exercise will be a review",
        type : REC_TYPES.review,
        icon : REC_ICONS[REC_TYPES.review]
    }
};

export {CONDITIONS, REC_RESPONSES};