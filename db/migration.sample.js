var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/database');

db.serialize(function() {
  // Insert query here
})

db.close();
