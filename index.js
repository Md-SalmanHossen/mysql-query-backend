const app = require('./app'); // Assuming your code is in app.js
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
