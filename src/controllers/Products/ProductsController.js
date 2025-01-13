const db = require("../../config/db"); // MySQL connection instance
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListTwoJoinService = require("../../services/common/ListTwoJoinService");
const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByID");
const DropDownService = require("../../services/common/DrowpDownService");

// Create a new product
exports.CreateProducts = async (req, res) => {
    try {
        const result = await CreateService(req, "products");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
exports.UpdateProducts = async (req, res) => {
    try {
        const result = await UpdateService(req, "products");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// List products with two joins and search
exports.ProductsList = async (req, res) => {
    try {
        const searchKeyword = `%${req.params.searchKeyword}%`;
        const joinStage1 = `LEFT JOIN brands ON products.BrandID = brands.id`;
        const joinStage2 = `LEFT JOIN categories ON products.CategoryID = categories.id`;
        const searchConditions = `
            products.Name LIKE ? OR 
            products.Unit LIKE ? OR 
            products.Details LIKE ? OR 
            brands.Name LIKE ? OR 
            categories.Name LIKE ?
        `;
        const result = await ListTwoJoinService(req, "products", searchConditions, [searchKeyword, searchKeyword, searchKeyword, searchKeyword, searchKeyword], joinStage1, joinStage2);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product details by ID
exports.ProductsDetailsByID = async (req, res) => {
    try {
        const result = await DetailsByIDService(req, "products");
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product
exports.DeleteProduct = async (req, res) => {
    try {
        const deleteID = req.params.id;

        // Check associations
        const checkReturn = await CheckAssociateService(`SELECT * FROM returns WHERE ProductID = ?`, [deleteID]);
        const checkPurchase = await CheckAssociateService(`SELECT * FROM purchases WHERE ProductID = ?`, [deleteID]);
        const checkSale = await CheckAssociateService(`SELECT * FROM sales WHERE ProductID = ?`, [deleteID]);

        if (checkReturn.length > 0) {
            res.status(200).json({ status: "associate", data: "Associate with Return" });
        } else if (checkPurchase.length > 0) {
            res.status(200).json({ status: "associate", data: "Associate with Purchase" });
        } else if (checkSale.length > 0) {
            res.status(200).json({ status: "associate", data: "Associate with Sale" });
        } else {
            const result = await DeleteService(req, "products");
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get dropdown list of products
exports.ProductsDropDown = async (req, res) => {
    try {
        const result = await DropDownService(req, "products", ["id", "Name"]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
