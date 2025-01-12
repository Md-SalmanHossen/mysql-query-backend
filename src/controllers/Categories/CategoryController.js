const CategoriesModel = require("../../models/category/CategoriesModel");
const ProductsModel = require("../../models/product/ProductsModel");

const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");

const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");

const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByID");


// Create a category
exports.CreateCategories = async (req, res) => {
    try {
        const result = await CreateService(req, CategoriesModel.tableName);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create category." });
    }
};

// Update a category
exports.UpdateCategories = async (req, res) => {
    try {
        const result = await UpdateService(req, CategoriesModel.tableName);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update category." });
    }
};

// List categories with search
exports.CategoriesList = async (req, res) => {
    try {
        const searchKeyword = req.params.searchKeyword || "";
        const searchQuery = `%${searchKeyword}%`;
        const searchFields = ["Name"]; // Adjust fields as per your DB schema
        const result = await ListService(CategoriesModel.tableName, searchQuery, searchFields);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch categories." });
    }
};

// Dropdown for categories
exports.CategoriesDropDown = async (req, res) => {
    try {
        const result = await DropDownService(CategoriesModel.tableName, { id: 1, Name: 1 });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dropdown data for categories." });
    }
};

// Details by ID
exports.CategoriesDetailsByID = async (req, res) => {
    try {
        const result = await DetailsByIDService(req.params.id, CategoriesModel.tableName);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch category details." });
    }
};

// Delete a category
exports.DeleteCategories = async (req, res) => {
    try {
        const deleteID = req.params.id;
        const isAssociated = await CheckAssociateService({ CategoryID: deleteID }, ProductsModel.tableName);

        if (isAssociated) {
            res.status(200).json({ status: "associate", data: "Associated with Product" });
        } else {
            const result = await DeleteService(deleteID, CategoriesModel.tableName);
            res.status(200).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete category." });
    }
};
