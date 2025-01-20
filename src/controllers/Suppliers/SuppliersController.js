const SuppliersModel = require("../../models/suppliers/SuppliersModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");
const DetailsByIDService = require("../../services/common/DetailsByID");
const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const DeleteService = require("../../services/common/DeleteService");

exports.CreateSuppliers = async (req, res) => {
    try {
        const result = await CreateService(req.body, SuppliersModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.UpdateSuppliers = async (req, res) => {
    try {
        const result = await UpdateService(req.body, SuppliersModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.SuppliersList = async (req, res) => {
    try {
        const result = await ListService(req.params.searchKeyword, SuppliersModel.tableName, ["Name", "Phone", "Email", "Address"]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.SuppliersDropDown = async (req, res) => {
    try {
        const result = await DropDownService(SuppliersModel.tableName, ["id", "Name"]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.SuppliersDetailsByID = async (req, res) => {
    try {
        const result = await DetailsByIDService(req.params.id, SuppliersModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.DeleteSupplier = async (req, res) => {
    try {
        const isAssociated = await CheckAssociateService(req.params.id, "purchases", "SupplierID");

        if (isAssociated) {
            res.status(409).json({ status: "error", message: "Supplier is associated with purchases" });
        } else {
            const result = await DeleteService(req.params.id, SuppliersModel.tableName);
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
