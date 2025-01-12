const db = require('../../config/db.js');

const SalesReportService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];
        const FormDate = Request.body['FormDate'];
        const ToDate = Request.body['ToDate'];

        if (!UserEmail || !FormDate || !ToDate) {
            return { status: "fail", message: "Email, FormDate, and ToDate are required." };
        }

        // Query for total sales amount for the given date range and UserEmail
        const totalSalesQuery = `
            SELECT SUM(sp.Total) AS totalSalesAmount
            FROM sales_products sp
            WHERE sp.UserEmail = ?
              AND sp.CreatedDate BETWEEN ? AND ?;
        `;
        const [totalSalesResult] = await db.execute(totalSalesQuery, [UserEmail, FormDate, ToDate]);
        const totalSalesAmount = totalSalesResult[0]?.totalSalesAmount || 0;

        // Query for sales data with product, brand, and category information
        const salesDataQuery = `
            SELECT 
                sp.ProductID,
                sp.Total,
                sp.CreatedDate,
                DATE_FORMAT(sp.CreatedDate, '%Y-%m-%d') AS FormattedDate,
                p.Name AS ProductName,
                b.BrandName,
                c.CategoryName
            FROM sales_products sp
            LEFT JOIN products p ON sp.ProductID = p.ID
            LEFT JOIN brands b ON p.BrandID = b.ID
            LEFT JOIN categories c ON p.CategoryID = c.ID
            WHERE sp.UserEmail = ?
              AND sp.CreatedDate BETWEEN ? AND ?
            ORDER BY sp.CreatedDate DESC;
        `;
        const [salesData] = await db.execute(salesDataQuery, [UserEmail, FormDate, ToDate]);

        // Return the result
        return {
            status: "success",
            data: {
                totalSalesAmount,
                salesData,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { status: "fail", message: "An error occurred while fetching sales report", data: error.toString() };
    }
};

module.exports = SalesReportService;
