const ParentModel = require("../../models/purches/PurchesModel");
const ChildsModel = require("../../models/purches/PurchesProductModel");
const CreateParentChildsService = require("../../services/common/CreateParentChildsService");
const ListOneJoinService = require("../../services/common/ListOneJoinService");
const DeleteParentChildsService = require("../../services/common/DeleteParentChildsService");
const db = require("../../config/db"); // Assuming db connection is set up

// Create Purchases (Parent and Child)
exports.CreatePurchases = async (req, res) => {
    let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'PurchaseID');
    res.status(200).json(Result);
};

// List Purchases with Supplier details
exports.PurchasesList = async (req, res) => {
    const { searchKeyword } = req.params; // Get search keyword from URL params
    const SearchRgx = `%${searchKeyword}%`; // SQL LIKE syntax for search

    try {
        // Query to join Purchases and Suppliers tables
        const query = `
            SELECT p.*, s.Name AS SupplierName, s.Address AS SupplierAddress, s.Phone AS SupplierPhone, s.Email AS SupplierEmail
            FROM purchases p
            LEFT JOIN suppliers s ON p.SupplierID = s._id
            WHERE p.Note LIKE ? OR s.Name LIKE ? OR s.Address LIKE ? OR s.Phone LIKE ? OR s.Email LIKE ?
        `;
        
        // Execute query with parameters
        const [rows] = await db.query(query, [SearchRgx, SearchRgx, SearchRgx, SearchRgx, SearchRgx]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Delete Purchase (Parent and Child)
exports.PurchasesDelete = async (req, res) => {
    let Result = await DeleteParentChildsService(req, ParentModel, ChildsModel, 'PurchaseID');
    res.status(200).json(Result);
};
