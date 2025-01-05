const ExpensesModel = require("../../models/Expenses/ExpensesModel");  // Your Expenses model
const sequelize = require("sequelize");  // Sequelize for MySQL queries

const ExpenseSummaryService = async (Request) => {
    try {
        let UserEmail = Request.headers['email'];

        // Fetch total expense amount from the Expenses table for the given UserEmail
        const totalExpenseAmount = await ExpensesModel.sum('Amount', {
            where: { UserEmail: UserEmail },
        });

        // Fetch the last 30 days of expenses, grouped by date
        const last30DaysExpenses = await ExpensesModel.findAll({
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'Date'],  // Group by date
                [sequelize.fn('SUM', sequelize.col('Amount')), 'TotalAmount']
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
                totalExpenseAmount,
                last30DaysExpenses
            }
        };

    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ExpenseSummaryService;
