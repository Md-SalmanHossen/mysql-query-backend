const db = require('../../config/db');

const UserDetailsService = async (Request) => {
    try {
        const email = Request.headers['email'];
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(sql, [email]);
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserDetailsService;
