const db = require('../../config/db.js');

const ExpenseReportService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];
        const FormDate = Request.body['FormDate'];
        const ToDate = Request.body['ToDate'];

        if (!UserEmail || !FormDate || !ToDate) {
            return { status: "fail", message: "Email, FormDate, and ToDate are required." };
        }

        // Query for total expense amount for the given date range and UserEmail
        const totalExpenseQuery = `
            SELECT SUM(Amount) AS totalExpenseAmount
            FROM expenses
            WHERE UserEmail = ?
              AND CreatedDate BETWEEN ? AND ?;
        `;
        const [totalExpenseResult] = await db.execute(totalExpenseQuery, [UserEmail, FormDate, ToDate]);
        const totalExpenseAmount = totalExpenseResult[0]?.totalExpenseAmount || 0;

        // Query for detailed expense data with expense type information
        const expenseDataQuery = `
            SELECT 
                e.TypeID,
                e.Amount,
                e.CreatedDate,
                DATE_FORMAT(e.CreatedDate, '%Y-%m-%d') AS FormattedDate,
                et.TypeName
            FROM expenses e
            LEFT JOIN expense_types et ON e.TypeID = et.ID
            WHERE e.UserEmail = ?
              AND e.CreatedDate BETWEEN ? AND ?
            ORDER BY e.CreatedDate DESC;
        `;
        const [expenseData] = await db.execute(expenseDataQuery, [UserEmail, FormDate, ToDate]);

        // Return the result
        return {
            status: "success",
            data: {
                totalExpenseAmount,
                expenseData,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { status: "fail", message: "An error occurred while fetching expense report", data: error.toString() };
    }
};

module.exports = ExpenseReportService;
