var AirfareScanner = require('./lib/airfare-scanner');

var scanner = new AirfareScanner(30000);
scanner.on('data', function (data) {
  console.log('Flight best price is ' + JSON.stringify(data));
});
scanner.on('error', function (err) {
  console.error(err);
});

var tripOptions = {
  adults: 1,
  originAirpot: 'MOW',
  destinationAirport: 'KJA',
  date: '2015-08-15',
  dateBack: '2015-08-29'
};
scanner.scan(tripOptions);
