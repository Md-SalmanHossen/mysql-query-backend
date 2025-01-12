const db = require('../../config/db');

const UserVerifyOtpService = async (Request) => {
    try {
        const { email, otp } = Request.params;

        // Check if the OTP is valid and not used
        const otpCheckQuery = `SELECT COUNT(*) AS total FROM otps WHERE email = ? AND otp = ? AND status = 0`;
        const [[otpResult]] = await db.execute(otpCheckQuery, [email, otp]);

        if (otpResult.total > 0) {
            // Mark the OTP as used
            const updateOtpQuery = `UPDATE otps SET status = 1 WHERE email = ? AND otp = ? AND status = 0`;
            const [updateResult] = await db.execute(updateOtpQuery, [email, otp]);

            return { status: "success", data: updateResult };
        } else {
            return { status: "fail", data: "Invalid OTP Code" };
        }
    } catch (error) {
        return { status: "fail", data: "An error occurred while verifying OTP." };
    }
};

module.exports = UserVerifyOtpService;
