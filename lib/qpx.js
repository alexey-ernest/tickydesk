/*
QPX Google API client.
*/

var request = require('request');
var debug = require('debug')('tickydesk:qpx');

var api = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=';

var QPX = function (token) {
  if (!token) {
    throw new Error('token required.');
  }

  this.token = token;
};

QPX.prototype.find = function (options, cb) {
  options = options || {};

  var adults = options.adults || 1;
  var originAirpot = options.originAirpot;
  var destinationAirport = options.destinationAirport;
  var date = options.date;
  var dateBack = options.dateBack;

  debug('\n\n Searching for airfares...');

  // building trip info
  var flights = [];
  flights.push({
    "origin": originAirpot,
    "destination": destinationAirport,
    "date": date
  });

  if (dateBack) {
    flights.push({
      "origin": destinationAirport,
      "destination": originAirpot,
      "date": dateBack
    });
  }

  var trip_options = {
    "request": {
      "passengers": {
        "adultCount": adults
      },
      "slice": flights,
      "solutions": 10
    }
  };

  // making request
  var url = api + this.token;
  var request_options = {
    method: 'post',
    body: trip_options,
    json: true,
    url: url
  };

  request(request_options, function (err, res, body) {
    if (err) {
      return cb(err);
    }
    if (200 !== res.statusCode) {
      return cb(new Error('Invalid status code: ' + res.statusCode +
        '. Details: ' + JSON.stringify(body)));
    }
    if (body.trips.tripOption.length === 0) {
      return cb();
    }

    var cheapestTrip = body.trips.tripOption[0];
    var total = parseInt(cheapestTrip.saleTotal.substr(3), 10);
    var carrier = cheapestTrip.slice[0].segment[0].flight.carrier;

    cb(null, {total: total, carrier: carrier});

    debug('The cheapest price found is ' + total + ' by ' + carrier);
  });
};

module.exports = QPX;