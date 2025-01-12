const db = require('../../config/db');
const SendEmailUtility = require('../../utils/SendMailUtility');

const UserVerifyEmailService = async (Request) => {
    try {
        const { email } = Request.params;
        const OTPCode = Math.floor(100000 + Math.random() * 900000);

        // Check if the user exists
        const checkUserQuery = `SELECT COUNT(*) AS total FROM users WHERE email = ?`;
        const [[userResult]] = await db.execute(checkUserQuery, [email]);

        if (userResult.total > 0) {
            // Insert the OTP for the user
            const otpInsertQuery = `INSERT INTO otps (email, otp) VALUES (?, ?)`;
            await db.execute(otpInsertQuery, [email, OTPCode]);

            // Send the email with the OTP
            const sendEmail = await SendEmailUtility(email, `Your PIN Code is ${OTPCode}`, "Inventory PIN Verification");

            return { status: "success", data: sendEmail };
        } else {
            return { status: "fail", data: "No User Found" };
        }
    } catch (error) {
        return { status: "fail", data: "An error occurred while verifying the email." };
    }
};

module.exports = UserVerifyEmailService;
