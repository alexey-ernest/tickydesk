/*
Airfares scanner.
*/

var debug = require('debug')('tickydesk:scanner');
var events = require('events');
var util = require('util');
var QPX = require('./qpx');

function scan(qpx, i, tripOptions, interval, cb) {
  debug('Checking price for flight from ' + tripOptions.originAirport +
    ' to ' + tripOptions.destinationAirport + ' at ' + tripOptions.date);

  i = i % qpx.length;
  var qpxClient = qpx[i];
  qpxClient.search(tripOptions, function (err, result) {
    if (err) {
      cb(err);
    }
    cb(null, result);

    setTimeout(scan, interval, qpx, i + 1, tripOptions, interval, cb);
  });
}

var AirfareScanner = function (interval) {
  this.interval = interval;
};

util.inherits(AirfareScanner, events.EventEmitter);

AirfareScanner.prototype.scan = function (options) {
  var scanner = this;

  var api_key = process.env.QPX_API_KEY;
  if (!api_key) {
    throw new Error('QPX_API_KEY environment variable required.');
  }

  var qpx = [];
  var keys = api_key.split(',');
  keys.forEach(function (k) {
    qpx.push(new QPX(k));
  });

  scan(qpx, 0, options, this.interval, function (err, result) {
    if (err) {
      return scanner.emit('error', err);
    }
    scanner.emit('data', result);
  });
};

module.exports = AirfareScanner;