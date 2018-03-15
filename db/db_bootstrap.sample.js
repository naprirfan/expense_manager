var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database');
var config = require('../config.js')

db.serialize(function() {

  /**
  * Expense Category
  */
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
    ("Birokrasi"),
    ("Lain-lain")
  `

  db.run(`INSERT INTO expense_category (name) VALUES ${values}`);

  db.each("SELECT * FROM expense_category", function(err, row) {
    console.log(row.id + ': ' + row.name);
  });

  /**
  * Income Category
  */
  db.run(`DROP TABLE IF EXISTS income_category`)

  db.run(`CREATE TABLE income_category (
    id INTEGER PRIMARY KEY,
    name TEXT
  )`);

  values = `
    ("Gaji"),
    ("Lain - lain")
  `

  db.run(`INSERT INTO income_category (name) VALUES ${values}`);

  db.each("SELECT * FROM income_category", function(err, row) {
    console.log(row.id + ': ' + row.name);
  });

  /**
  * Account
  */
  db.run(`DROP TABLE IF EXISTS account`)

  db.run(`CREATE TABLE account (
    id INTEGER PRIMARY KEY,
    name TEXT,
    display VARCHAR(3),
    amount INTEGER
  )`);

  values = `
    ("BCA", 'yes', 250000),
    ("Commbank", 'yes', 20000000),
    ("Mandiri", 'yes', 95000),
    ("E-Toll", 'yes', 95000),
    ("Credit Card", 'yes', 0),
    ("BukaDompet", 'yes', 200000),
    ("Cash A", 'yes', 1000000),
    ("Cash B", 'yes', 200000),
    ("Gojek-Gopay A", 'yes', 200000),
    ("Gojek-Gopay B", 'yes', 200000),
    ("Ethereum", 'no', 5000000),
    ("Reksadana", 'no', 77000000),
    ("Saham", 'no', 0)
  `
  db.run(`INSERT INTO account (name, display, amount) VALUES ${values}`);

  db.each("SELECT * FROM account", function(err, row) {
    console.log(row.id + ': ' + row.name + '; ' + row.display);
  });

  /**
  * Context
  */
  db.run(`DROP TABLE IF EXISTS context`)

  db.run(`CREATE TABLE context (
    chat_id INTEGER PRIMARY KEY,
    key TEXT NULL,
    value TEXT NULL,
    created_at DATETIME
  )`);

  let contextArr = config.TELEGRAM_CHAT_IDS.map(item => {
    return `(${item})`
  })
  values = contextArr.join(',')

  db.run(`INSERT INTO context (chat_id) VALUES ${values}`);

  db.each("SELECT * FROM context", function(err, row) {
    console.log(row.chat_id);
  });

  /**
  * Transactions
  */
  db.run(`DROP TABLE IF EXISTS transactions`)

  db.run(`DROP TABLE IF EXISTS transactions`)

  db.run(`CREATE TABLE transactions (
    id INTEGER PRIMARY KEY,
    name TEXT,
    amount INTEGER,
    created_by INTEGER,
    expense_category_id INTEGER NULL REFERENCES expense_category(id),
    income_category_id INTEGER NULL REFERENCES income_category(id),
    account_id INTEGER NOT NULL REFERENCES account(id),
    expense_category_name TEXT,
    income_category_name TEXT,
    account_name TEXT,
    created_at DATETIME
  )`);

});

db.close();
