
//mysql database connection
const mysql = require('mysql2/promise'); 

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'salman29',
  database: process.env.DB_NAME || 'MarketInsight',
});
module.exports=pool;