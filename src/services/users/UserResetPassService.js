const db = require('../../config/db');

const UserResetPassService = async (Request) => {
    const { email, OTP, password } = Request.body;

    try {
        // Check if the OTP is valid and used
        const otpQuery = `
            SELECT COUNT(*) AS total 
            FROM otps 
            WHERE email = ? AND otp = ? AND status = 1
        `;
        const [[otpResult]] = await db.execute(otpQuery, [email, OTP]);

        if (otpResult.total > 0) {
            // Update the user's password
            const updateQuery = `
                UPDATE users 
                SET password = ? 
                WHERE email = ?
            `;
            const [result] = await db.execute(updateQuery, [password, email]);

            if (result.affectedRows > 0) {
                return { status: "success", message: "Password reset successfully", data: result };
            } else {
                return { status: "fail", message: "User not found or update failed" };
            }
        } else {
            return { status: "fail", message: "Invalid OTP or request" };
        }
    } catch (error) {
        return { status: "fail", message: "An error occurred while resetting the password", data: error.toString() };
    }
};

module.exports = UserResetPassService;
