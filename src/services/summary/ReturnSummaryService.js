const ReturnsModel = require("../../models/Returns/ReturnsModel");  // Your Returns model
const sequelize = require("sequelize");  // Sequelize for MySQL queries

const ReturnSummaryService = async (Request) => {
    try {
        let UserEmail = Request.headers['email'];

        // Fetch total return amount from the Returns table for the given UserEmail
        const totalReturnAmount = await ReturnsModel.sum('GrandTotal', {
            where: { UserEmail: UserEmail },
        });

        // Fetch the last 30 days of returns, grouped by date
        const last30DaysReturns = await ReturnsModel.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'Date'],  // Group by date
                [sequelize.fn('SUM', sequelize.col('GrandTotal')), 'TotalAmount']
            ],
            where: {
                UserEmail: UserEmail,
                CreatedDate: {
                    [sequelize.Op.gte]: sequelize.fn('NOW', sequelize.literal('INTERVAL 30 DAY')),  // Filter for the last 30 days
                }
            },
            group: [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d')],  // Group by formatted date
            order: [[sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'DESC']],  // Sort by date descending
            limit: 30  // Limit to the last 30 days
        });

        return {
            status: "success",
            data: {
                totalReturnAmount,
                last30DaysReturns
            }
        };

    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ReturnSummaryService;
