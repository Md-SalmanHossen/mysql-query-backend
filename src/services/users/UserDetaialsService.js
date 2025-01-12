const db = require('../../config/db');

const UserDetailsService = async (Request) => {
    try {
        const email = Request.headers['email'];

        if (!email) {
            return { status: "fail", message: "Email header is required" };
        }

        const sql = `
            SELECT id, email, firstName, lastName, mobile, photo, created_at, updated_at 
            FROM users 
            WHERE email = ?
        `;
        const [rows] = await db.execute(sql, [email]);

        if (rows.length > 0) {
            return { status: "success", data: rows[0] };
        } else {
            return { status: "fail", message: "User not found" };
        }
    } catch (error) {
        return { status: "fail", message: "An error occurred while fetching user details", data: error.toString() };
    }
};

module.exports = UserDetailsService;
