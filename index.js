var request = require('request');
var debug = require('debug')('tickydesk:scanner');
var QPX = require('./lib/qpx');

var api_key = process.env.QPX_API_KEY;
var qpx = new QPX(api_key);

var tripOptions = {
  adults: 1,
  originAirpot: 'MOW',
  destinationAirport: 'KJA',
  date: '2015-08-15',
  dateBack: '2015-08-29'
};
qpx.find(tripOptions, function (err, result) {
  if (err) {
    throw err;
  }

  console.log(result);
});
