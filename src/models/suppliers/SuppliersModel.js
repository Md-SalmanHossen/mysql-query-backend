module.exports = {
   createTableQuery: `
     CREATE TABLE IF NOT EXISTS suppliers (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       Name VARCHAR(255),
       Address TEXT,
       Phone VARCHAR(255) UNIQUE,
       Email VARCHAR(255),
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
   `
 };
 