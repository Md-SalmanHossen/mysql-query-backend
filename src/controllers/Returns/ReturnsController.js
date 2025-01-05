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
    let query = `
        SELECT r.*, c.CustomerName, c.Address, c.Phone, c.Email
        FROM returns r
        LEFT JOIN customers c ON r.CustomerID = c._id
        WHERE r.Note LIKE ? OR c.CustomerName LIKE ? OR c.Address LIKE ? OR c.Phone LIKE ? OR c.Email LIKE ?
    `;
    let result = await db.query(query, [
        `%${searchKeyword}%`,
        `%${searchKeyword}%`,
        `%${searchKeyword}%`,
        `%${searchKeyword}%`,
        `%${searchKeyword}%`
    ]);
    res.status(200).json(result[0]);
}

// Delete Return (Parent and Child records)
exports.ReturnDelete = async (req, res) => {
    let result = await DeleteParentChildsService(req, db, 'returns', 'returnproducts', 'ReturnID');
    res.status(200).json(result);
}
