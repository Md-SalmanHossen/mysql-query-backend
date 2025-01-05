module.exports = {
   createTableQuery: `
     CREATE TABLE IF NOT EXISTS expenses (
       id INT AUTO_INCREMENT PRIMARY KEY,
       UserEmail VARCHAR(255),
       TypeID INT,
       Amount DECIMAL(10, 2),
       Note TEXT,
       CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (TypeID) REFERENCES expensetypes(id) ON DELETE CASCADE
     );
   `
 };
 