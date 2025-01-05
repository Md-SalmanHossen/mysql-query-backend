const db = require('../config/db');

const UserUpdateService = async (Request) => {
    try {
        const email = Request.headers['email'];
        const { firstName, lastName, mobile, photo } = Request.body;

        const sql = `UPDATE users SET firstName = ?, lastName = ?, mobile = ?, photo = ? WHERE email = ?`;
        const [result] = await db.execute(sql, [firstName, lastName, mobile, photo, email]);

        return { status: "success", data: result };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserUpdateService;
