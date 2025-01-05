module.exports = {
   createTableQuery: `
     CREATE TABLE IF NOT EXISTS purchaseproducts (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       PurchaseID INT,
       ProductID INT,
       Qty INT,
       UnitCost DECIMAL(10, 2),
       Total DECIMAL(10, 2),
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (PurchaseID) REFERENCES purchases(id),
       FOREIGN KEY (ProductID) REFERENCES products(id)
     );
   `
 };
 