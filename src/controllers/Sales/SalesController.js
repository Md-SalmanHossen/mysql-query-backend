const ParentModel = require("../../models/sells/SalesModel");
const ChildsModel = require("../../models/sells/SalesProductsModel");
const CreateParentChildsService = require("../../services/common/CreateParentChildsService");
const ListOneJoinService = require("../../services/common/ListOneJoinService.js");
const DeleteParentChildsService = require("../../services/common/DeleteParentChildsService");

const db = require("../../config/db"); // Assuming db connection is defined

// Create Sales
exports.CreateSales = async (req, res) => {
    let result = await CreateParentChildsService(req, db, 'sales', 'saleproducts', 'SaleID');
    res.status(200).json(result);
}

// Sales List with Search and Join (with customers table)
exports.SalesList = async (req, res) => {
    let searchKeyword = req.params.searchKeyword;
    let query = `
        SELECT s.*, c.CustomerName, c.Address, c.Phone, c.Email
        FROM sales s
        LEFT JOIN customers c ON s.CustomerID = c._id
        WHERE s.Note LIKE ? OR c.CustomerName LIKE ? OR c.Address LIKE ? OR c.Phone LIKE ? OR c.Email LIKE ?
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

// Delete Sale (Parent and Child records)
exports.SaleDelete = async (req, res) => {
    let result = await DeleteParentChildsService(req, db, 'sales', 'saleproducts', 'SaleID');
    res.status(200).json(result);
}
