const BrandsModel = require("../../models/brands/BrandsModel");
const ProductsModel = require("../../models/product/ProductsModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");
const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const DeleteService = require("../../services/common/DeleteService");
const DetailsByIDService = require("../../services/common/DetailsByID");

exports.CreateBrand = async (req, res) => {
    try {
        const result = await CreateService(req.body, BrandsModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.UpdateBrand = async (req, res) => {
    try {
        const result = await UpdateService(req.body, BrandsModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.BrandList = async (req, res) => {
    try {
        const result = await ListService(req.params.searchKeyword, BrandsModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.BrandDetailsByID = async (req, res) => {
    try {
        const result = await DetailsByIDService(req.params.id, BrandsModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.BrandDropDown = async (req, res) => {
    try {
        const result = await DropDownService(BrandsModel.tableName, ["id", "Name"]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.DeleteBrand = async (req, res) => {
    try {
        const isAssociated = await CheckAssociateService(
            { BrandID: req.params.id },
            ProductsModel.tableName
        );

        if (isAssociated) {
            return res
                .status(409)
                .json({ status: "associate", message: "Brand is associated with products" });
        }

        const result = await DeleteService(req.params.id, BrandsModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
