const db = require("../../config/db.js");

const ReturnSummaryService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];

        if (!UserEmail) {
            return { status: "fail", message: "Email header is required" };
        }

        // Query for total return amount
        const totalReturnAmountQuery = `
            SELECT SUM(GrandTotal) AS totalReturnAmount 
            FROM returns 
            WHERE UserEmail = ?;
        `;
        const [totalReturnAmountResult] = await db.execute(totalReturnAmountQuery, [UserEmail]);
        const totalReturnAmount = totalReturnAmountResult[0]?.totalReturnAmount || 0;

        // Query for last 30 days' returns grouped by date
        const last30DaysReturnsQuery = `
            SELECT 
                DATE(CreatedDate) AS Date,
                SUM(GrandTotal) AS TotalAmount
            FROM returns
            WHERE UserEmail = ?
              AND CreatedDate >= NOW() - INTERVAL 30 DAY
            GROUP BY DATE(CreatedDate)
            ORDER BY Date DESC
            LIMIT 30;
        `;
        const [last30DaysReturns] = await db.execute(last30DaysReturnsQuery, [UserEmail]);

        return {
            status: "success",
            data: {
                totalReturnAmount,
                last30DaysReturns,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { status: "fail", message: "An error occurred while fetching return summary", data: error.toString() };
    }
};

module.exports = ReturnSummaryService;
