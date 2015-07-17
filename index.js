var AirfareScanner = require('./lib/airfare-scanner');
var Airfare = require('./models/airfare');
var Trip = require('./models/trip');



/*
var trip = new Trip({
  adults: 1,
  originAirport: 'MOW',
  destinationAirport: 'KJA',
  date: '2015-08-15',
  dateBack: '2015-08-29'
});
trip.save(function (err, id) {
  if (err) console.error(err);
  console.log(id);
});
*/

var tripId = '9158f963-4da8-4778-ab80-fd77f86c5236';
Trip.get(tripId, function (err, trip) {
  if (err) return console.error(err);
  if (!trip) return console.error('There are no trip with specified id.');
  var tripOptions = {
    adults: trip.adults,
    originAirport: trip.originAirport,
    destinationAirport: trip.destinationAirport,
    date: trip.date,
    dateBack: trip.dateBack
  };
  scanner.scan(tripOptions);
});

var scanner = new AirfareScanner(30000);
scanner.on('data', function (data) {
  console.log('Flight best price is ' + JSON.stringify(data));

  // save price
  var airfare = new Airfare({
    tripId: tripId,
    price: data.total
  });
  airfare.save(function (err) {
    if (err) return console.error('Error on saving price: ' + err);
  });
});
scanner.on('error', function (err) {
  console.error(err);
});