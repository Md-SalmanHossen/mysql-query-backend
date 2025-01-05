
module.exports = {
  createTableQuery: `
    CREATE TABLE IF NOT EXISTS otps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255),
      otp VARCHAR(6),
      status INT DEFAULT 0,
      createdDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
};
