const ParentModel = require("../../models/Returns/ReturnsModel");
const ChildsModel = require("../../models/Returns/ReturnProductsModel");
const CreateParentChildsService = require("../../services/common/CreateParentChildsService");
const ListOneJoinService = require("../../services/common/ListOneJoinService");
const DeleteParentChildsService = require("../../services/common/DeleteParentChildsService");

const db = require("../../config/db"); // Assuming db connection is defined

// Create Returns
exports.CreateReturns = async (req, res) => {
    let result = await CreateParentChildsService(req, db, 'returns', 'returnproducts', 'ReturnID');
    res.status(200).json(result);
}

// Returns List with Search and Join (with customers table)
exports.ReturnsList = async (req, res) => {
    let searchKeyword = req.params.searchKeyword;

    // SQL LIKE syntax for search
    let searchRgx = `%${searchKeyword}%`;

    // Query to join Returns and Customers tables
    let query = `
        SELECT r.*, c.CustomerName, c.Address, c.Phone, c.Email
        FROM returns r
        LEFT JOIN customers c ON r.CustomerID = c._id
        WHERE r.Note LIKE ? OR c.CustomerName LIKE ? OR c.Address LIKE ? OR c.Phone LIKE ? OR c.Email LIKE ?
    `;

    try {
        // Execute query with parameters
        const [rows] = await db.query(query, [
            searchRgx,
            searchRgx,
            searchRgx,
            searchRgx,
            searchRgx
        ]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

// Delete Return (Parent and Child records)
exports.ReturnDelete = async (req, res) => {
    let result = await DeleteParentChildsService(req, db, 'returns', 'returnproducts', 'ReturnID');
    res.status(200).json(result);
}
