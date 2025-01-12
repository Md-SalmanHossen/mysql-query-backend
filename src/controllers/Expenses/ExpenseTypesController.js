const DataModel = require("../../models/expense/ExpenseTypesModel");
const ExpensesModel = require("../../models/expense/ExpenseModel");
const CreateService = require("../../services/common/CreateService");
const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");
const DetailsByIDService = require("../../services/common/DetailsByID");
const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const DeleteService = require("../../services/common/DeleteService");

exports.CreateExpenseTypes = async (req, res) => {
    try {
        const result = await CreateService(req.body, DataModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.UpdateExpenseTypes = async (req, res) => {
    try {
        const result = await UpdateService(req.body, DataModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.ExpenseTypesList = async (req, res) => {
    try {
        const result = await ListService(req.params.searchKeyword, DataModel.tableName, ["Name"]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.ExpenseTypesDropDown = async (req, res) => {
    try {
        const result = await DropDownService(DataModel.tableName, ["id", "Name"]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.ExpenseTypesDetailsByID = async (req, res) => {
    try {
        const result = await DetailsByIDService(req.params.id, DataModel.tableName);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

exports.DeleteExpenseTypes = async (req, res) => {
    try {
        const isAssociated = await CheckAssociateService(req.params.id, ExpensesModel.tableName, "TypeID");

        if (isAssociated) {
            res.status(409).json({ status: "error", message: "Expense type is associated with expenses" });
        } else {
            const result = await DeleteService(req.params.id, DataModel.tableName);
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};
