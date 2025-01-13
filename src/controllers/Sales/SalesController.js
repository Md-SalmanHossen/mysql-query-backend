const ParentModel = require("../../models/sells/SalesModel");
const ChildsModel = require("../../models/sells/SalesProductsModel");
const CreateParentChildsService = require("../../services/common/CreateParentChildsService");
const ListOneJoinService = require("../../services/common/ListOneJoinService");
const DeleteParentChildsService = require("../../services/common/DeleteParentChildsService");
const db = require("../../config/db"); // Assuming db connection is set up

// Create Sales (Parent and Child)
exports.CreateSales = async (req, res) => {
    let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'SaleID');
    res.status(200).json(Result);
};

// List Sales with Customer details using raw MySQL queries
exports.SalesList = async (req, res) => {
    const { searchKeyword } = req.params; // Get search keyword from URL params
    const SearchRgx = `%${searchKeyword}%`; // SQL LIKE syntax for search

    try {
        // Define the raw SQL query for joining sales and customers
        const query = `
            SELECT s.*, c.CustomerName, c.Address AS CustomerAddress, c.Phone AS CustomerPhone, c.Email AS CustomerEmail
            FROM sales s
            LEFT JOIN customers c ON s.CustomerID = c._id
            WHERE s.Note LIKE ? 
            OR c.CustomerName LIKE ? 
            OR c.Address LIKE ? 
            OR c.Phone LIKE ? 
            OR c.Email LIKE ?
        `;

        // Execute the query using the db connection
        const [rows] = await db.query(query, [SearchRgx, SearchRgx, SearchRgx, SearchRgx, SearchRgx]);
        
        // Return the result
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Delete Sale (Parent and Child)
exports.SaleDelete = async (req, res) => {
    let Result = await DeleteParentChildsService(req, ParentModel, ChildsModel, 'SaleID');
    res.status(200).json(Result);
};
