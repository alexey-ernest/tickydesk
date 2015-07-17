/*
Airfare model.
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
  insertAirfare: 'INSERT INTO airfare (tripid, datetime, price) VALUES(?, ?, ?)',
  selectByTrip: 'SELECT tripid, datetime, price FROM airfare WHERE tripid = ?'
};

var Airfare = function (obj) {
  var attr;
  for (attr in obj) {
    if (obj.hasOwnProperty(attr)) {
      this[attr] = obj[attr];
    }
  }
};

Airfare.prototype.save = function (fn) {
  var airfare = this;

  this.datetime = new Date();
  var args = [
    this.tripId,
    this.datetime,
    this.price
  ];
  client.execute(cql.insertAirfare, args, { prepare: true }, function (err) {
    if (err) {
      return fn(err);
    }
    fn(null, airfare.datetime);
  });
};

Airfare.prototype.getByTrip = function (tripId, fn) {
  client.execute(cql.selectByTrip, [tripId], { prepare: true }, function (err, result) {
    if (err) {
      return fn(err);
    }

    var airfares = result.rows.map(function (r) {
      var obj = {
        tripId: r.tripid,
        datetime: new Date(r.datetime),
        price: r.price
      };
      return new Airfare(obj);
    });
    fn(null, airfares);
  });
};

module.exports = Airfare;
