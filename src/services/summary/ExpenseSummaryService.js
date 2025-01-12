const db = require("../../config/db.js");

const ExpenseSummaryService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];

        if (!UserEmail) {
            return { status: "fail", message: "Email header is required" };
        }

        // Query for total expense amount
        const totalExpenseQuery = `
            SELECT SUM(Amount) AS totalExpenseAmount 
            FROM expenses 
            WHERE UserEmail = ?;
        `;
        const [totalExpenseResult] = await db.execute(totalExpenseQuery, [UserEmail]);
        const totalExpenseAmount = totalExpenseResult[0]?.totalExpenseAmount || 0;

        // Query for last 30 days' expenses grouped by date
        const last30DaysExpensesQuery = `
            SELECT 
                DATE(CreatedDate) AS Date,
                SUM(Amount) AS TotalAmount
            FROM expenses
            WHERE UserEmail = ? 
              AND CreatedDate >= NOW() - INTERVAL 30 DAY
            GROUP BY DATE(CreatedDate)
            ORDER BY Date DESC
            LIMIT 30;
        `;
        const [last30DaysExpenses] = await db.execute(last30DaysExpensesQuery, [UserEmail]);

        // Metadata Query: Total number of days with expenses
        const totalDaysQuery = `
            SELECT COUNT(DISTINCT DATE(CreatedDate)) AS totalDays 
            FROM expenses 
            WHERE UserEmail = ?;
        `;
        const [totalDaysResult] = await db.execute(totalDaysQuery, [UserEmail]);
        const totalDays = totalDaysResult[0]?.totalDays || 0;

        return {
            status: "success",
            data: {
                totalExpenseAmount,
                last30DaysExpenses,
                totalDays,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { status: "fail", message: "An error occurred while fetching expense summary", data: error.toString() };
    }
};

module.exports = ExpenseSummaryService;
