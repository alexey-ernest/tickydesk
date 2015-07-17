DROP KEYSPACE IF EXISTS airfare;
CREATE KEYSPACE airfare WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 2 };

use airfare;

CREATE TABLE trip (
   tripid uuid,
   adults int,
   origin_airport text,
   destination_airport text,
   date text,
   date_back text,
   PRIMARY KEY (tripid)
);

CREATE TABLE airfare (
   tripid uuid,
   airfareid timeuuid,
   price int,
   PRIMARY KEY (tripid, airfareid)
) WITH CLUSTERING ORDER BY (airfareid ASC);