var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database');

db.serialize(function() {
  db.run(`DROP TABLE IF EXISTS expense_category`)

  db.run(`CREATE TABLE expense_category (
    id INTEGER PRIMARY KEY,
    name TEXT
  )`);

  let values = `
    ("Makan di luar"),
    ("Bensin"),
    ("Toll"),
    ("Parkir"),
    ("Laundry"),
    ("Pesen Gojek"),
    ("Grocery"),
    ("Sedekah"),
    ("Cuci Mobil"),
    ("Cicilan Mobil"),
    ("Pulsa or Paket Data"),
    ("Lain-lain")
  `

  db.run(`INSERT INTO expense_category (name) VALUES ${values}`);

  db.each("SELECT * FROM expense_category", function(err, row) {
    console.log(row.id + ': ' + row.name);
  });

  db.run(`DROP TABLE IF EXISTS income_category`)

  db.run(`CREATE TABLE income_category (
    id INTEGER PRIMARY KEY,
    name TEXT
  )`);

  values = `
    ("Gaji")
  `

  db.run(`INSERT INTO income_category (name) VALUES ${values}`);

  db.each("SELECT * FROM income_category", function(err, row) {
    console.log(row.id + ': ' + row.name);
  });

  db.run(`DROP TABLE IF EXISTS account`)

  db.run(`CREATE TABLE account (
    id INTEGER PRIMARY KEY,
    name TEXT
  )`);

  values = `
    ("BCA"),
    ("Commbank"),
    ("Mandiri"),
    ("BukaDompet"),
    ("Ethereum"),
    ("Gojek A"),
    ("Gojek B")
  `
  db.run(`INSERT INTO account (name) VALUES ${values}`);

  db.each("SELECT * FROM account", function(err, row) {
    console.log(row.id + ': ' + row.name);
  });

  db.run(`DROP TABLE IF EXISTS transactions`)

  db.run(`CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    name TEXT,
    expense_category_id INTEGER NULL REFERENCES expense_category(id),
    income_category_id INTEGER NULL REFERENCES income_category(id),
    account_id INTEGER NOT NULL REFERENCES account(id),
    created_at DATETIME
  )`);

});

db.close();
