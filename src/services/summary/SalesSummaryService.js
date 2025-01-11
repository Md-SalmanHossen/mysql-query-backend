const SalesModel = require("../../models/sells/SalesModel");  // Your Sales model

const SalesSummaryService = async (Request) => {
    try {
        let UserEmail = Request.headers['email'];
        
        // Fetch total amount from the Sales table for the given UserEmail
        const totalAmount = await SalesModel.sum('GrandTotal', {
            where: { UserEmail: UserEmail },
        });

        // Fetch the last 30 days of sales, grouped by date
        const last30DaysSales = await SalesModel.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'Date'],  // Group by date
                [sequelize.fn('SUM', sequelize.col('GrandTotal')), 'TotalAmount']
            ],
            where: {
                UserEmail: UserEmail,
                CreatedDate: {
                    [sequelize.Op.gte]: sequelize.fn('NOW', sequelize.literal('INTERVAL 30 DAY')),
                }
            },
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d')],  // Group by formatted date
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'DESC']], // Sort by date descending
            limit: 30  // Limit to the last 30 days
        });

        return {
            status: "success",
            data: {
                totalAmount,
                last30DaysSales
            }
        };

    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = SalesSummaryService;
