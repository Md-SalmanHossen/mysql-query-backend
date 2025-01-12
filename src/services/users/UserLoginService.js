const db = require('../../config/db.js');
const CreateToken = require('../../utils/CreateToken.js');

const UserLoginService = async (Request) => {
    try {
        const { email, password } = Request.body;

        // Fetch user details with matching email and password
        const sql = `
            SELECT email, firstName, lastName, mobile, photo 
            FROM users 
            WHERE email = ? AND password = ?
        `;
        const [rows] = await db.execute(sql, [email, password]);

        if (rows.length > 0) {
            // Create a token for the authenticated user
            const token = await CreateToken(rows[0].email);

            return {
                status: "success",
                token,
                data: rows[0],
            };
        } else {
            return { status: "unauthorized", message: "Invalid email or password" };
        }
    } catch (error) {
        return {
            status: "fail",
            message: "An error occurred during login",
            data: error.toString(),
        };
    }
};

module.exports = UserLoginService;
