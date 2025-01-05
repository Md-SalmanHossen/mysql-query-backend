const db = require('../config/db');

const UserVerifyOtpService = async (Request) => {
    try {
        const { email, otp } = Request.params;
        const otpCheckQuery = `SELECT COUNT(*) AS total FROM otps WHERE email = ? AND otp = ? AND status = 0`;
        const [otpResult] = await db.execute(otpCheckQuery, [email, otp]);

        if (otpResult[0].total > 0) {
            const updateOtpQuery = `UPDATE otps SET status = 1 WHERE email = ? AND otp = ? AND status = 0`;
            const [result] = await db.execute(updateOtpQuery, [email, otp]);
            return { status: "success", data: result };
        } else {
            return { status: "fail", data: "Invalid OTP Code" };
        }
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserVerifyOtpService;
