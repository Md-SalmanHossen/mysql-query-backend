const DataModel = require("../../models/category/CategoriesModel");
const ProductsModel = require("../../models/product/ProductsModel");
const CreateService = require("../../services/common/CreateService");

const UpdateService = require("../../services/common/UpdateService");
const ListService = require("../../services/common/ListService");
const DropDownService = require("../../services/common/DrowpDownService");

const CheckAssociateService = require("../../services/common/CheeckAssociateService");
const DeleteService = require("../../services/common/DeleteService");
//const mongoose = require("mongoose");
const DetailsByIDService = require("../../services/common/DetailsByID");

exports.CreateCategories=async (req, res) => {
    let Result= await CreateService(req,DataModel)
    res.status(200).json(Result)
}

exports.UpdateCategories=async (req, res) => {
    let Result=await UpdateService(req,DataModel)
    res.status(200).json(Result)
}


const CategoriesList = async (req, res) => {
    try {
        const searchKeyword = req.params.searchKeyword;
        const searchQuery = `%${searchKeyword}%`; // MySQL LIKE pattern
        const query = `SELECT * FROM categories WHERE Name LIKE ?`; // Adjust "categories" and "Name" as per your table/column names
        
        // Execute the query with the search keyword
        const [results] = await db.execute(query, [searchQuery]);
        
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching categories." });
    }
};

module.exports = { CategoriesList };


exports.CategoriesDropDown=async (req, res) => {
    let Result= await DropDownService(req,DataModel,{_id:1,Name:1})
    res.status(200).json(Result)
}


exports.CategoriesDetailsByID=async (req, res) => {
    let Result= await DetailsByIDService(req,DataModel)
    res.status(200).json(Result)
}


exports.DeleteCategories=async (req, res) => {
    let DeleteID=req.params.id;
    const ObjectId = mongoose.Types.ObjectId;
    let CheckAssociate= await CheckAssociateService({CategoryID:ObjectId(DeleteID)},ProductsModel);
    if(CheckAssociate){
        res.status(200).json({status: "associate", data: "Associate with Product"})
    }
    else{
        let Result=await DeleteService(req,DataModel);
        res.status(200).json(Result)
    }
}