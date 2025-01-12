const db = require("../../config/db.js");

const PurchaseSummaryService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];

        if (!UserEmail) {
            return { status: "fail", message: "Email header is required" };
        }

        // Query for total purchase amount
        const totalPurchaseQuery = `
            SELECT SUM(GrandTotal) AS totalPurchaseAmount 
            FROM purchases 
            WHERE UserEmail = ?;
        `;
        const [totalPurchaseResult] = await db.execute(totalPurchaseQuery, [UserEmail]);
        const totalPurchaseAmount = totalPurchaseResult[0]?.totalPurchaseAmount || 0;

        // Query for last 30 days' purchases grouped by date
        const last30DaysPurchasesQuery = `
            SELECT 
                DATE(CreatedDate) AS Date,
                SUM(GrandTotal) AS TotalAmount
            FROM purchases
            WHERE UserEmail = ? 
              AND CreatedDate >= NOW() - INTERVAL 30 DAY
            GROUP BY DATE(CreatedDate)
            ORDER BY Date DESC
            LIMIT 30;
        `;
        const [last30DaysPurchases] = await db.execute(last30DaysPurchasesQuery, [UserEmail]);

        return {
            status: "success",
            data: {
                totalPurchaseAmount,
                last30DaysPurchases,
            },
        };
    } catch (error) {
        return { status: "fail", message: "An error occurred while fetching purchase summary", data: error.toString() };
    }
};

module.exports = PurchaseSummaryService;
