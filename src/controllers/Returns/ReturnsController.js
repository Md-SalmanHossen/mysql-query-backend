const ParentModel = require("../../models/returns/ReturnsModel");
const ChildModel = require("../../models/returns/ReturnProductsModel");

const CreateParentChildsService = require("../../services/common/CreateParentChildsService");
const ListOneJoinService = require("../../services/common/ListOneJoinService");
const DeleteParentChildsService = require("../../services/common/DeleteParentChildsService");

// Create Returns
exports.CreateReturns = async (req, res) => {
    try {
        let result = await CreateParentChildsService(req, ParentModel, ChildModel); // Models passed to service
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Returns List
exports.ReturnsList = async (req, res) => {
    try {
        let result = await ListOneJoinService(req, ParentModel); // ParentModel passed to service
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Delete Returns
exports.ReturnDelete = async (req, res) => {
    try {
        let result = await DeleteParentChildsService(req, ParentModel, ChildModel); // Models passed to service
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
