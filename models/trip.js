/*
Trip model.
*/

var cassandra = require('cassandra-driver');

var cassandraHosts = process.env.CASSANDRA_HOSTS.split(',');
var cassandraUsername = process.env.CASSANDRA_USERNAME;
var cassandraPassword = process.env.CASSANDRA_PASSWORD;

var authProvider = new cassandra.auth.PlainTextAuthProvider(cassandraUsername,
  cassandraPassword);
var client = new cassandra.Client({
  contactPoints: cassandraHosts,
  authProvider: authProvider,
  keyspace: 'airfare'
});

var cql = {
  insertTrip: 'INSERT INTO trip (tripid, adults, origin_airport, destination_airport, date, date_back) VALUES (?, ?, ?, ?, ?, ?)',
  selectTrip: 'SELECT tripid, adults, origin_airport, destination_airport, date, date_back FROM trip WHERE tripid = ?'
};

var Trip = function (obj) {
  var attr;
  for (attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      this[attr] = obj[attr];
    }
  }
};

Trip.prototype.save = function (fn) {
  var trip = this;

  this.id = cassandra.types.Uuid.random();
  var args = [
    this.id,
    this.adults,
    this.originAirport,
    this.destinationAirport,
    this.date,
    this.dateBack
  ];
  client.execute(cql.insertTrip, args, { prepare: true }, function (err) {
    if (err) {
      return fn(err);
    }
    fn(null, trip.id);
  });
};

Trip.get = function (id, fn) {
  client.execute(cql.selectTrip, [id], { prepare: true }, function (err, result) {
    if (err) {
      return fn(err);
    }
    var trip = null;
    if (result.rows.length === 1) {
      var data = result.rows[0];
      var obj = {
        id: data.tripid,
        adults: data.adults,
        originAirport: data.origin_airport,
        destionationAirport: data.destination_airport,
        date: data.date,
        dateBack: data.date_back
      };
      trip = new Trip(obj);
    }
    fn(null, trip);
  });
};

module.exports = Trip;
