const db = require("../../config/db.js");

const SalesSummaryService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];

        if (!UserEmail) {
            return { status: "fail", message: "Email header is required" };
        }

        // Query for total sales amount
        const totalSalesQuery = `
            SELECT SUM(GrandTotal) AS totalAmount 
            FROM sales 
            WHERE UserEmail = ?;
        `;
        const [totalSalesResult] = await db.execute(totalSalesQuery, [UserEmail]);
        const totalAmount = totalSalesResult[0]?.totalAmount || 0;

        // Query for last 30 days' sales grouped by date
        const last30DaysSalesQuery = `
            SELECT 
                DATE(CreatedDate) AS Date,
                SUM(GrandTotal) AS TotalAmount
            FROM sales
            WHERE UserEmail = ?
              AND CreatedDate >= NOW() - INTERVAL 30 DAY
            GROUP BY DATE(CreatedDate)
            ORDER BY Date DESC
            LIMIT 30;
        `;
        const [last30DaysSales] = await db.execute(last30DaysSalesQuery, [UserEmail]);

        return {
            status: "success",
            data: {
                totalAmount,
                last30DaysSales,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging during development
        return { status: "fail", message: "An error occurred while fetching sales summary", data: error.toString() };
    }
};

module.exports = SalesSummaryService;
