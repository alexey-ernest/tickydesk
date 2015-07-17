/*
QPX Google API client.
*/

var request = require('request');
var debug = require('debug')('tickydesk:qpx');

var api = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=';

var QPX = function (key) {
  if (!key) {
    throw new Error('key required.');
  }

  this.key = key;
};

QPX.prototype.search = function (options, cb) {
  options = options || {};

  var adults = options.adults || 1;
  var originAirport = options.originAirport;
  var destinationAirport = options.destinationAirport;
  var date = options.date;
  var dateBack = options.dateBack;

  debug('\n\n Searching for airfares using key ' + this.key);

  // building trip info
  var flights = [];
  flights.push({
    "origin": originAirport,
    "destination": destinationAirport,
    "date": date
  });

  if (dateBack) {
    flights.push({
      "origin": destinationAirport,
      "destination": originAirport,
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

  debug('Request body: ' + JSON.stringify(trip_options));

  // making request
  var url = api + this.key;
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