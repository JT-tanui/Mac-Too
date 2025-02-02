const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const dbPromise = open({
    filename: path.join(__dirname, '../database.sqlite'),
    driver: sqlite3.Database
}).then(db => {
    console.log('Database connected');
    return db;
}).catch(err => {
    console.error('Database connection error:', err);
    throw err;
});

module.exports = { dbPromise };