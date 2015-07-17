var AirfareScanner = require('./lib/airfare-scanner');
var Airfare = require('./models/airfare');
var Trip = require('./models/trip');

var scanner = new AirfareScanner(30000);
scanner.on('data', function (data) {
  console.log('Flight best price is ' + JSON.stringify(data));
});
scanner.on('error', function (err) {
  console.error(err);
});

var tripOptions = {
  adults: 1,
  originAirport: 'MOW',
  destinationAirport: 'KJA',
  date: '2015-08-15',
  dateBack: '2015-08-29'
};
//scanner.scan(tripOptions);

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

Trip.get('b676ebd8-6658-45d1-a0a3-9ad2634e83d4', function (err, trip) {
  if (err) return console.error(err);
  console.log(JSON.stringify(trip));
});
