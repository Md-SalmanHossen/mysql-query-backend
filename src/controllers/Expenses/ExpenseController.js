const DataModel = require("../../models/Expenses/ExpensesModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListOneJoinService = require("../../services/common/ListOneJoinService");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByIDService");
const db = require("../../config/db"); // Assuming db connection is set up

exports.CreateExpenses = async (req, res) => {
    let Result = await CreateService(req, DataModel);
    res.status(200).json(Result);
}

exports.UpdateExpenses = async (req, res) => {
    let Result = await UpdateService(req, DataModel);
    res.status(200).json(Result);
}

exports.ExpensesList = async (req, res) => {
    const { searchKeyword } = req.params;
    const SearchRgx = `%${searchKeyword}%`; // SQL LIKE syntax for search

    try {
        // SQL JOIN query to search expenses and join with ExpenseTypes
        const query = `
            SELECT * FROM ${DataModel.tableName} AS expenses
            LEFT JOIN expensetypes AS types ON expenses.TypeID = types._id
            WHERE expenses.Note LIKE ? OR types.Name LIKE ?
        `;
        
        // Execute query with parameters
        const [rows] = await db.query(query, [SearchRgx, SearchRgx]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.ExpenseDetailsByID = async (req, res) => {
    let Result = await DetailsByIDService(req, DataModel);
    res.status(200).json(Result);
}

exports.DeleteExpense = async (req, res) => {
    let Result = await DeleteService(req, DataModel);
    res.status(200).json(Result);
}
