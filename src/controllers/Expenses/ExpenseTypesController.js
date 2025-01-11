const DataModel = require("../../models/expense/ExpenseTypesModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");

const DropDownService = require("../../services/common/DrowpDownService");
const db = require("../../config/db"); // Assuming db connection is set up
const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const ExpensesModel = require("../../models/expense/ExpenseModel");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByID");

exports.CreateExpenseTypes = async (req, res) => {
    let Result = await CreateService(req, DataModel);
    res.status(200).json(Result);
}

exports.UpdateExpenseTypes = async (req, res) => {
    let Result = await UpdateService(req, DataModel);
    res.status(200).json(Result);
}

exports.ExpenseTypesList = async (req, res) => {
    const { searchKeyword } = req.params;
    const SearchRgx = `%${searchKeyword}%`; // SQL LIKE syntax for search
    
    try {
        // Query to search in ExpenseTypes table
        const query = `
            SELECT * FROM ${DataModel.tableName}
            WHERE Name LIKE ?
        `;
        
        // Execute query with parameters
        const [rows] = await db.query(query, [SearchRgx]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.ExpenseTypesDropDown = async (req, res) => {
    try {
        // Query to get only _id and Name for dropdown
        const query = `SELECT _id, Name FROM ${DataModel.tableName}`;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.ExpenseTypesDetailsByID = async (req, res) => {
    let Result = await DetailsByIDService(req, DataModel);
    res.status(200).json(Result);
}

exports.DeleteExpenseTypes = async (req, res) => {
    const DeleteID = req.params.id;

    try {
        // Check if there are associated records in ExpensesModel
        const query = `SELECT * FROM ${ExpensesModel.tableName} WHERE TypeID = ?`;
        const [associatedRecords] = await db.query(query, [DeleteID]);

        if (associatedRecords.length > 0) {
            res.status(200).json({ status: "associate", data: "Associate with Expenses" });
        } else {
            // Delete the expense type if no associations are found
            let Result = await DeleteService(req, DataModel);
            res.status(200).json(Result);
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}
