const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '../db/database.sqlite');
const dbPromise = open({
    filename: dbPath,
    driver: sqlite3.Database
});

module.exports = { dbPromise };