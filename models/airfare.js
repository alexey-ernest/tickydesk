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

var Airfare = function (obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
};

Airfare.prototype.connect = function () {
  client.connect(function (err, result) {
    if (err) return console.error(err);
    console.log('Connected.');

    client.hosts.slice(0).map(function (node) {
      console.log({ address : node.address, rack : node.rack, datacenter : node.datacenter });
    });
  });
};

module.exports = Airfare;