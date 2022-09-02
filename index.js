const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(passTimes) {
  for (const time of passTimes) {
    const date = new Date(time.risetime * 1000).toUTCString().toLocaleString("en-US");
    const duration = time.duration;
    console.log(`Next pass at ${date} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});


