var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./db/database');

db.serialize(function() {
  /**
  * Investment
  */
  db.run(`DROP TABLE IF EXISTS investment`)

  db.run(`CREATE TABLE investment (
    id INTEGER PRIMARY KEY,
    name TEXT,
    current_value INTEGER,
    base_value INTEGER,
    notes TEXT
  )`);

  db.run(`DROP TABLE IF EXISTS investment_log`)

  db.run(`CREATE TABLE investment_log (
    id INTEGER PRIMARY KEY,
    name TEXT,
    investment_id INTEGER,
    amount INTEGER,
    notes TEXT
  )`);

})

db.close();
