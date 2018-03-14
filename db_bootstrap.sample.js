var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database');
var config = require('./config.js')

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
    ("Gaji")
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
    display VARCHAR(3)
  )`);

  values = `
    ("BCA", 'yes'),
    ("Commbank", 'yes'),
    ("Mandiri", 'yes'),
    ("BukaDompet", 'yes'),
    ("Gojek-Gopay A", 'yes'),
    ("Gojek-Gopay B", 'yes'),
    ("Ethereum", 'no'),
    ("Reksadana", 'no'),
    ("Saham", 'no')
  `
  db.run(`INSERT INTO account (name, display) VALUES ${values}`);

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
    created_by TEXT,
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
