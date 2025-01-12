const db = require('../../config/db.js');
const bcrypt = require('bcrypt');

const UserCreateService = async (Request) => {
    try {
        const { email, firstName, lastName, mobile, password, photo } = Request.body;

        // Validate required fields
        if (!email || !firstName || !lastName || !mobile || !password) {
            return { status: "fail", message: "All fields are required" };
        }

        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const sql = `
            INSERT INTO users (email, firstName, lastName, mobile, password, photo) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [email, firstName, lastName, mobile, hashedPassword, photo || null]);

        if (result.affectedRows > 0) {
            return {
                status: "success",
                message: "User created successfully",
                data: { id: result.insertId, email, firstName, lastName, mobile, photo },
            };
        } else {
            return { status: "fail", message: "Failed to create user" };
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return { status: "fail", message: "Email already exists" };
        }
        return { status: "fail", message: "An error occurred while creating the user", data: error.toString() };
    }
};

module.exports = UserCreateService;
