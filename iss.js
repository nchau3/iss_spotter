const request = require('request');


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(`https://api.ipify.org/?format=json`, (error, response, body) => {
    if (error) {
      return callback(error);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const data = JSON.parse(body);
    return callback(null, data.ip) && fetchCoordByIP();
  });
};

const fetchCoordByIP = function(IP, callback) {
  request(`http://ipwho.is/${IP}?output=json`, (error, response, body) => {
    if (error) {
      return callback(error);
    }
    const data = JSON.parse(body);
    if (!data.success) {
      const msg = `Success status is ${data.success}. Server message was ${data.message} for IP address ${data.ip}`;
      callback(msg, null);
      return;
    }
    const coord = {latitude: data.latitude, longitiude: data.longitude};
    return callback(null, coord);
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitiude}`, (error, response, body) => {
    if (error) {
      return callback(error);
    }
    if (body === 'invalid coordinates') {
      return callback(body, null);
    }
    const data = JSON.parse(body);
    const flyOverTimes = data.response;
    return callback(null, flyOverTimes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
  
    fetchCoordByIP(ip, ((error, coord) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
    
      fetchISSFlyOverTimes(coord, ((error, flyOverTimes) => {
        if (error) {
          console.log("It didn't work!" , error);
          return;
        }
        //final callback, return flyOverTimes
        return callback(null, flyOverTimes);
      }));
    }));
  });
};

module.exports = { fetchMyIP, fetchCoordByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};