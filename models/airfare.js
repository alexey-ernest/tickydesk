/*
Airfare model.
*/

var Airfare = function (obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
};

