const db = require("../../config/db"); // Import the MySQL connection

// Create OTP Table Query
const createOtpTableQuery = `
  CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255),
    otp VARCHAR(6),
    status INT DEFAULT 0,
    createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Function to create OTP table

module.exports = {
  createOtpTableQuery
};
