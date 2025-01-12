const db = require('../../config/db.js');

const ReturnReportService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];
        const FormDate = Request.body['FormDate'];
        const ToDate = Request.body['ToDate'];

        if (!UserEmail || !FormDate || !ToDate) {
            return { status: "fail", message: "Email, FormDate, and ToDate are required." };
        }

        // Query for total return amount for the given date range and UserEmail
        const totalReturnQuery = `
            SELECT SUM(rp.Total) AS totalReturnAmount
            FROM return_products rp
            WHERE rp.UserEmail = ?
              AND rp.CreatedDate BETWEEN ? AND ?;
        `;
        const [totalReturnResult] = await db.execute(totalReturnQuery, [UserEmail, FormDate, ToDate]);
        const totalReturnAmount = totalReturnResult[0]?.totalReturnAmount || 0;

        // Query for return data with product, brand, and category information
        const returnDataQuery = `
            SELECT 
                rp.ProductID,
                rp.Total,
                rp.CreatedDate,
                DATE_FORMAT(rp.CreatedDate, '%Y-%m-%d') AS FormattedDate,
                p.Name AS ProductName,
                b.BrandName,
                c.CategoryName
            FROM return_products rp
            LEFT JOIN products p ON rp.ProductID = p.ID
            LEFT JOIN brands b ON p.BrandID = b.ID
            LEFT JOIN categories c ON p.CategoryID = c.ID
            WHERE rp.UserEmail = ?
              AND rp.CreatedDate BETWEEN ? AND ?
            ORDER BY rp.CreatedDate DESC;
        `;
        const [returnData] = await db.execute(returnDataQuery, [UserEmail, FormDate, ToDate]);

        // Return the result
        return {
            status: "success",
            data: {
                totalReturnAmount,
                returnData,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { status: "fail", message: "An error occurred while fetching return report", data: error.toString() };
    }
};

module.exports = ReturnReportService;
