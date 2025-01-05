const DataModel = require("../../models/Suppliers/SuppliersModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DropDownService");
const CheckAssociateService = require("../../services/common/CheckAssociateService");
const PurchasesModel = require("../../models/Purchases/PurchasesModel");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByIDService");

const db = require("../../config/db"); // Assuming db connection is defined

exports.CreateSuppliers = async (req, res) => {
    let result = await CreateService(req, db, 'suppliers');
    res.status(200).json(result);
}

exports.UpdateSuppliers = async (req, res) => {
    let result = await UpdateService(req, db, 'suppliers');
    res.status(200).json(result);
}

exports.SuppliersList = async (req, res) => {
    let searchKeyword = req.params.searchKeyword;
    let query = `SELECT * FROM suppliers WHERE Name LIKE ? OR Phone LIKE ? OR Email LIKE ? OR Address LIKE ?`;
    let result = await db.query(query, [`%${searchKeyword}%`, `%${searchKeyword}%`, `%${searchKeyword}%`, `%${searchKeyword}%`]);
    res.status(200).json(result[0]);
}

exports.SuppliersDropDown = async (req, res) => {
    let query = `SELECT _id, Name FROM suppliers`;
    let result = await db.query(query);
    res.status(200).json(result[0]);
}

exports.SuppliersDetailsByID = async (req, res) => {
    let query = `SELECT * FROM suppliers WHERE _id = ?`;
    let result = await db.query(query, [req.params.id]);
    res.status(200).json(result[0]);
}

exports.DeleteSupplier = async (req, res) => {
    let deleteID = req.params.id;
    let queryCheck = `SELECT * FROM purchases WHERE SupplierID = ?`;
    let checkAssociate = await db.query(queryCheck, [deleteID]);

    if (checkAssociate[0].length > 0) {
        res.status(200).json({ status: "associate", data: "Associate with Purchases" });
    } else {
        let result = await DeleteService(req, db, 'suppliers');
        res.status(200).json(result);
    }
}
