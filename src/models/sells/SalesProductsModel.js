module.exports = {
   createSalesProduct: `
     CREATE TABLE IF NOT EXISTS sale_products (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       SaleID INT,
       ProductID INT,
       Qty INT,
       UnitCost DECIMAL(10, 2),
       Total DECIMAL(10, 2),
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (SaleID) REFERENCES sales(id) ON DELETE CASCADE,
       FOREIGN KEY (ProductID) REFERENCES products(id) ON DELETE CASCADE
     );
   `
 };
 