const db = require('../../config/db.js');

const UserCreateService = async (Request) => {
    try {
        const { email, firstName, lastName, mobile, password, photo } = Request.body;
        const sql = `INSERT INTO users (email, firstName, lastName, mobile, password, photo) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(sql, [email, firstName, lastName, mobile, password, photo]);
        return { status: "success", data: result };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserCreateService;
