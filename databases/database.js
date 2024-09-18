const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
};

const db = mysql.createConnection(dbConfig);

module.exports = db;
