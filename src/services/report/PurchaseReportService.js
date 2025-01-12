const db = require('../../config/db.js');

const PurchasesReportService = async (Request) => {
    try {
        const UserEmail = Request.headers['email'];
        const FormDate = Request.body['FormDate'];
        const ToDate = Request.body['ToDate'];

        if (!UserEmail || !FormDate || !ToDate) {
            return { status: "fail", message: "Email, FormDate, and ToDate are required." };
        }

        // Query for total purchase amount for the given date range and UserEmail
        const totalPurchaseQuery = `
            SELECT SUM(pp.Total) AS totalPurchaseAmount
            FROM purchase_products pp
            WHERE pp.UserEmail = ?
              AND pp.CreatedDate BETWEEN ? AND ?;
        `;
        const [totalPurchaseResult] = await db.execute(totalPurchaseQuery, [UserEmail, FormDate, ToDate]);
        const totalPurchaseAmount = totalPurchaseResult[0]?.totalPurchaseAmount || 0;

        // Query for purchase data with product, brand, and category information
        const purchaseDataQuery = `
            SELECT 
                pp.ProductID,
                pp.Total,
                pp.CreatedDate,
                DATE_FORMAT(pp.CreatedDate, '%Y-%m-%d') AS FormattedDate,
                p.Name AS ProductName,
                b.BrandName,
                c.CategoryName
            FROM purchase_products pp
            LEFT JOIN products p ON pp.ProductID = p.ID
            LEFT JOIN brands b ON p.BrandID = b.ID
            LEFT JOIN categories c ON p.CategoryID = c.ID
            WHERE pp.UserEmail = ?
              AND pp.CreatedDate BETWEEN ? AND ?
            ORDER BY pp.CreatedDate DESC;
        `;
        const [purchaseData] = await db.execute(purchaseDataQuery, [UserEmail, FormDate, ToDate]);

        // Return the result
        return {
            status: "success",
            data: {
                totalPurchaseAmount,
                purchaseData,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging
        return { status: "fail", message: "An error occurred while fetching purchases report", data: error.toString() };
    }
};

module.exports = PurchasesReportService;
