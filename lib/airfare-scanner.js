/*
Airfares scanner.
*/

var debug = require('debug')('tickydesk:scanner');
var events = require('events');
var util = require('util');
var QPX = require('./qpx');

function scan(qpx, tripOptions, interval, cb) {
  debug('Checking price for flight from ' + tripOptions.originAirport +
    ' to ' + tripOptions.destinationAirport + ' at ' + tripOptions.date);

  qpx.search(tripOptions, function (err, result) {
    if (err) {
      cb(err);
    }
    cb(null, result);

    setTimeout(scan, interval, qpx, tripOptions, interval, cb);
  });
}

var AirfareScanner = function (interval) {
  this.interval = interval;
};

util.inherits(AirfareScanner, events.EventEmitter);

AirfareScanner.prototype.scan = function (options) {
  var scanner = this;

  var api_key = process.env.QPX_API_KEY;
  var qpx = new QPX(api_key);

  scan(qpx, options, this.interval, function (err, result) {
    if (err) {
      return scanner.emit('error', err);
    }
    scanner.emit('data', result);
  });
};

module.exports = AirfareScanner;