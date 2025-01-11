const db = require('../../config/db');
const SendEmailUtility = require('../../utils/SendMailUtility');

const UserVerifyEmailService = async (Request) => {
    try {
        const email = Request.params.email;
        const OTPCode = Math.floor(100000 + Math.random() * 900000);

        const checkUserQuery = `SELECT COUNT(*) AS total FROM users WHERE email = ?`;
        const [userResult] = await db.execute(checkUserQuery, [email]);

        if (userResult[0].total > 0) {
            const otpInsertQuery = `INSERT INTO otps (email, otp) VALUES (?, ?)`;
            await db.execute(otpInsertQuery, [email, OTPCode]);

            const sendEmail = await SendEmailUtility(email, `Your PIN Code is ${OTPCode}`, "Inventory PIN Verification");
            return { status: "success", data: sendEmail };
        } else {
            return { status: "fail", data: "No User Found" };
        }
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = UserVerifyEmailService;
