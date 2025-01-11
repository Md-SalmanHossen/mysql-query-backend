module.exports = {
   createBrandTable: `
     CREATE TABLE IF NOT EXISTS brands (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       Name VARCHAR(255) UNIQUE,
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
   `
 };
 