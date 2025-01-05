const db=require('../../config/db.js')
const CreateToken = require('../../utils/CreateToken.js');

const UserLoginService = async (Request) => {
    try {
        const { email, password } = Request.body;
        const sql = `SELECT email, firstName, lastName, mobile, photo FROM users WHERE email = ? AND password = ?`;
        const [rows] = await db.execute(sql, [email, password]);

        if (rows.length > 0) {
            const token = await CreateToken(rows[0].email);
            return { status: "success", token: token, data: rows[0] };
        } else {
            return { status: "unauthorized" };
        }
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserLoginService;
