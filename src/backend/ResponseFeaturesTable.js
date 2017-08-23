//@flow

const ResponseFeatures = {
  responseIsString: [0.049, -0.02],
  numberOfLastFiveWrong: [0.036, -0.033],
  percentPastErrors: [0, -0.004],
  helpRequest: [0, 0.066],
  percentHelpRequested: [0, -0.047],
  numberOfLast8HelpRequested: [0.042, -0.019],
  timeTaken: [0.002, -0.0002],
  timeTakenSD: [-0.024, 0.01],
  timeTakenInLast5Actions: [-0.003, 0.002],
  timeTakenOnThisConcept: [0.001, -0.001],
  numberOfTimesUsingConcept: [0.003, -0.001]
};

export default ResponseFeatures;