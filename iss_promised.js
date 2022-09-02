const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org/?format=json');
};

const fetchCoordByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`http://ipwho.is/${ip}?output=json`);
};

const fetchISSFlyOverTimes = function(body) {
  const latitude = JSON.parse(body).latitude;
  const longitude = JSON.parse(body).longitude;
  return request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`);
};

const printPassTimes = function(passTimes) {
  for (const time of passTimes) {
    const date = new Date(time.risetime * 1000).toUTCString().toLocaleString("en-US");
    const duration = time.duration;
    console.log(`Next pass at ${date} for ${duration} seconds!`);
  }
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const passTimes = JSON.parse(body).response;
      return passTimes;
  });
};

module.exports = { fetchMyIP, fetchCoordByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation, printPassTimes };