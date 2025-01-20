const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get the token from the Authorization header, prefixed by 'Bearer '
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: "unauthorized", message: "Token is missing" });
    }

    // Verify the token using the secret key stored in an environment variable
    jwt.verify(token, 'SecretKey123456789', (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "unauthorized", message: "Invalid or expired token" });
        } else {
            // Attach the email to the request object for further use
            req.headers.email = decoded.data;
            next(); // Proceed to the next middleware or route handler
        }
    });
};
