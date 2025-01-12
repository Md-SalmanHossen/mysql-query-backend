const DataModel = require("../../models/customer/CustomersModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByID");
const db = require("../../config/db"); // MySQL database connection

exports.CreateCustomers = async (req, res) => {
    try {
        const result = await CreateService(req.body, DataModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.UpdateCustomers = async (req, res) => {
    try {
        const result = await UpdateService(req.body, DataModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.CustomersList = async (req, res) => {
    const { searchKeyword } = req.params;
    const searchPattern = `%${searchKeyword}%`; // MySQL LIKE syntax for searching

    try {
        const query = `
            SELECT * FROM ${DataModel.tableName}
            WHERE CustomerName LIKE ? OR Phone LIKE ? OR Email LIKE ? OR Address LIKE ?
        `;
        const [rows] = await db.query(query, [searchPattern, searchPattern, searchPattern, searchPattern]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.CustomersDropDown = async (req, res) => {
    try {
        const result = await DropDownService(DataModel.tableName, ["id", "CustomerName"]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.CustomersDetailsByID = async (req, res) => {
    try {
        const result = await DetailsByIDService(req.params.id, DataModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.DeleteCustomer = async (req, res) => {
    try {
        const checkAssocQuery = `SELECT * FROM sales WHERE CustomerID = ?`;
        const [salesData] = await db.query(checkAssocQuery, [req.params.id]);

        if (salesData.length > 0) {
            res.status(409).json({ status: "associate", message: "Customer is associated with sales" });
        } else {
            const result = await DeleteService(req.params.id, DataModel.tableName);
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
