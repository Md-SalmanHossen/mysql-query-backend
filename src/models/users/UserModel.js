

module.exports = {
   createTableQuery: `
     CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       email VARCHAR(255) UNIQUE,
       firstName VARCHAR(255),
       lastName VARCHAR(255),
       mobile VARCHAR(15),
       password VARCHAR(255),
       photo VARCHAR(255),
       createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
   `
 };
 