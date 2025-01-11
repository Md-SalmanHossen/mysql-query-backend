module.exports = {
   createProductTable: `
     CREATE TABLE IF NOT EXISTS products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       CategoryID INT,
       BrandID INT,
       Name VARCHAR(255),
       Unit VARCHAR(50),
       Details TEXT,
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (CategoryID) REFERENCES categories(id) ON DELETE CASCADE,
       FOREIGN KEY (BrandID) REFERENCES brands(id) ON DELETE CASCADE
     );
   `
 };
 