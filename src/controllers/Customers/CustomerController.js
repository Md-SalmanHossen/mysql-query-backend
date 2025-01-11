const DataModel = require("../../models/customer/CustomersModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");

const DropDownService = require("../../services/common/DrowpDownService");
const db = require("../../config/db"); // Assuming you have a configured MySQL connection
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIdService = require("../../services/common/DetailsByID.js");

exports.CreateCustomers = async (req, res) => {
    let Result = await CreateService(req, DataModel);
    res.status(200).json(Result);
}

exports.UpdateCustomers = async (req, res) => {
    let Result = await UpdateService(req, DataModel);
    res.status(200).json(Result);
}

exports.CustomersList = async (req, res) => {
    const { searchKeyword } = req.params;
    const SearchRgx = `%${searchKeyword}%`; // MySQL LIKE syntax for searching
    
    try {
        // SQL query to search customers by multiple fields and match with LIKE
        const query = `
            SELECT * FROM ${DataModel.tableName} AS customers
            WHERE customers.CustomerName LIKE ? OR customers.Phone LIKE ? OR customers.Email LIKE ? OR customers.Address LIKE ?
        `;
        
        // Execute query with parameters
        const [rows] = await db.query(query, [SearchRgx, SearchRgx, SearchRgx, SearchRgx]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.CustomersDropDown = async (req, res) => {
    try {
        const query = `SELECT _id, CustomerName FROM ${DataModel.tableName}`;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.CustomersDetailsByID = async (req, res) => {
    let Result = await DetailsByIDService(req, DataModel);
    res.status(200).json(Result);
}

exports.DeleteCustomer = async (req, res) => {
    const DeleteID = req.params.id;

    try {
        // Check if the customer is associated with any sales
        const checkAssocQuery = `
            SELECT * FROM sales WHERE CustomerID = ?
        `;
        const [salesData] = await db.query(checkAssocQuery, [DeleteID]);

        if (salesData.length > 0) {
            // If associated with sales, respond with an error message
            res.status(200).json({ status: "associate", data: "Associate with Sales" });
        } else {
            // If no association, delete the customer
            const result = await DeleteService(req, DataModel);
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}
