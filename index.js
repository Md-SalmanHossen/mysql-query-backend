const app = require('./app'); // Assuming your code is in app.js
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

const EventEmitter = require('events');
const Bus = new EventEmitter();
Bus.setMaxListeners(20); // Increase max listeners if necessary

// Example of event listener
Bus.on('event', () => {
  console.log('Event triggered');
});

// Add trace to see where listeners are being added
Bus.on('event', () => {
  console.trace('Event listener added');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
