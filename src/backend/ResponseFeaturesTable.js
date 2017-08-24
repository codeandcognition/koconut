//@flow

/**
 * Factors out values for contextualized G and S
 * from Baker et al.
 */
const ResponseFeatures = {
  responseIsString:             {g: 0.049,  s: -0.02},
  numberOfLastFiveWrong:        {g: 0.036,  s: -0.033},
  percentPastErrors:            {g: 0,      s: -0.004},
  helpRequest:                  {g: 0,      s: 0.066},
  percentHelpRequested:         {g: 0,      s: -0.047},
  numberOfLast8HelpRequested:   {g: 0.042,  g: -0.019},
  timeTaken:                    {g: 0.002,  s: -0.0002},
  timeTakenSD:                  {g: -0.024, s: 0.01},
  timeTakenInLast5Actions:      {g: -0.003, s: 0.002},
  timeTakenOnThisConcept:       {g: 0.001,  s: -0.001},
  numberOfTimesUsingConcept:    {g: 0.003,  s:-0.001}
};

//Index for g in features
const g = 0;
//Index for s in features
const s = 1;

export {ResponseFeatures, g, s};