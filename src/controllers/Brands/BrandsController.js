const DataModel = require("../../models/Brands/BrandsModel");
const ProductsModel = require("../../models/product/ProductsModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");
const db = require("../../config/db"); // MySQL database connection
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByID");

exports.CreateBrand = async (req, res) => {
    let Result = await CreateService(req, DataModel);
    res.status(200).json(Result);
}

exports.UpdateBrand = async (req, res) => {
    let Result = await UpdateService(req, DataModel);
    res.status(200).json(Result);
}

exports.BrandList = async (req, res) => {
    const { searchKeyword } = req.params;
    const SearchRgx = `%${searchKeyword}%`; // MySQL LIKE syntax for searching
    
    try {
        // SQL query to search brands by the Name field
        const query = `
            SELECT * FROM ${DataModel.tableName}
            WHERE Name LIKE ?
        `;
        
        // Execute the query with parameters
        const [rows] = await db.query(query, [SearchRgx]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.BrandDropDown = async (req, res) => {
    try {
        const query = `SELECT _id, Name FROM ${DataModel.tableName}`;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}

exports.BrandDetailsByID = async (req, res) => {
    let Result = await DetailsByIDService(req, DataModel);
    res.status(200).json(Result);
}

exports.DeleteBrand = async (req, res) => {
    const DeleteID = req.params.id;

    try {
        // Check if the brand is associated with any products
        const checkAssocQuery = `
            SELECT * FROM ${ProductsModel.tableName} WHERE BrandID = ?
        `;
        const [productData] = await db.query(checkAssocQuery, [DeleteID]);

        if (productData.length > 0) {
            // If associated with products, respond with an error message
            res.status(200).json({ status: "associate", data: "Associate with Product" });
        } else {
            // If no association, delete the brand
            const result = await DeleteService(req, DataModel);
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}
