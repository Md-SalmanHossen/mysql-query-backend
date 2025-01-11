module.exports = {
   createPurchesTable: `
     CREATE TABLE IF NOT EXISTS purchases (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       SupplierID INT,
       VatTax DECIMAL(10, 2),
       Discount DECIMAL(10, 2),
       OtherCost DECIMAL(10, 2),
       ShippingCost DECIMAL(10, 2),
       GrandTotal DECIMAL(10, 2),
       Note TEXT,
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (SupplierID) REFERENCES suppliers(id)
     );
   `
 };
 