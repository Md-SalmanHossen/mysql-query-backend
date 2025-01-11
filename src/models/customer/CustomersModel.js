module.exports = {
   createCustomerTable: `
     CREATE TABLE IF NOT EXISTS customers (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       CustomerName VARCHAR(255),
       Phone VARCHAR(20) UNIQUE,
       Email VARCHAR(255),
       Address TEXT,
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
   `
 };
 