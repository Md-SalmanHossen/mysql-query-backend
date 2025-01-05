module.exports = {
   createTableQuery: `
     CREATE TABLE IF NOT EXISTS returnproducts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       ReturnID INT,
       ProductID INT,
       Qty INT,
       UnitCost DECIMAL(10, 2),
       Total DECIMAL(10, 2),
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (ReturnID) REFERENCES returns(id) ON DELETE CASCADE,
       FOREIGN KEY (ProductID) REFERENCES products(id) ON DELETE CASCADE
     );
   `
 };
 