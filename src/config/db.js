

//mysql database connection
const mysql = require('mysql2/promise'); 
const dotenv =require('dotenv');
dotenv.config();

// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
});
//db.setMaxListeners(2);

module.exports=db;