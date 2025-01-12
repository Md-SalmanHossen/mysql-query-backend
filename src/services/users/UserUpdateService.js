const db = require('../../config/db');

const UserUpdateService = async (Request) => {
    try {
        const email = Request.headers['email'];
        const { firstName, lastName, mobile, photo } = Request.body;

        // Update user details
        const sql = `
            UPDATE users 
            SET firstName = ?, lastName = ?, mobile = ?, photo = ? 
            WHERE email = ?
        `;
        const [result] = await db.execute(sql, [firstName, lastName, mobile, photo, email]);

        if (result.affectedRows > 0) {
            return { status: "success", message: "User updated successfully", data: result };
        } else {
            return { status: "fail", message: "No user found with the provided email" };
        }
    } catch (error) {
        return { status: "fail", message: "An error occurred while updating user details", data: error.toString() };
    }
};

module.exports = UserUpdateService;
