const ExpensesModel = require("../../models/Expenses/ExpensesModel"); // Your Expense model
const ExpenseTypeModel = require("../../models/ExpenseTypes/ExpenseTypeModel"); // Your ExpenseType model
const sequelize = require("sequelize"); // Sequelize for MySQL queries

const ExpenseReportService = async (Request) => {
    try {
        let UserEmail = Request.headers['email'];
        let FormDate = Request.body['FormDate'];
        let ToDate = Request.body['ToDate'];

        // Fetch total expense amount for the given date range and UserEmail
        const totalExpenseAmount = await ExpensesModel.sum('Amount', {
            where: {
                UserEmail: UserEmail,
                CreatedDate: {
                    [sequelize.Op.gte]: new Date(FormDate),
                    [sequelize.Op.lte]: new Date(ToDate),
                }
            }
        });

        // Fetch expense data with expense type information
        const expenseData = await ExpensesModel.findAll({
            attributes: [
                'TypeID',
                'Amount',
                'CreatedDate',
                [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'FormattedDate'] // Format the date
            ],
            where: {
                UserEmail: UserEmail,
                CreatedDate: {
                    [sequelize.Op.gte]: new Date(FormDate),
                    [sequelize.Op.lte]: new Date(ToDate),
                }
            },
            include: [
                {
                    model: ExpenseTypeModel,
                    attributes: ['TypeName'], // Expense type info
                }
            ]
        });

        // Return the result
        return {
            status: "success",
            data: {
                totalExpenseAmount,
                expenseData
            }
        };

    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ExpenseReportService;
