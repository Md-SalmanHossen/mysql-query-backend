const db = require('../config/db');

const UserResetPassService = async (Request) => {
    const { email, OTP, password } = Request.body;
    try {
        const otpQuery = `SELECT COUNT(*) AS total FROM otps WHERE email = ? AND otp = ? AND status = 1`;
        const [otpResult] = await db.execute(otpQuery, [email, OTP]);

        if (otpResult[0].total > 0) {
            const updateQuery = `UPDATE users SET password = ? WHERE email = ?`;
            const [result] = await db.execute(updateQuery, [password, email]);
            return { status: "success", data: result };
        } else {
            return { status: "fail", data: "Invalid Request" };
        }
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserResetPassService;
