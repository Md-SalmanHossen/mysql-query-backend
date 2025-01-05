const ReturnProductsModel = require("../../models/Returns/ReturnProductsModel"); // Your ReturnProducts model
const ProductModel = require("../../models/Products/ProductModel");  // Your Product model
const BrandModel = require("../../models/Brands/BrandModel");  // Your Brand model
const CategoryModel = require("../../models/Categories/CategoryModel");  // Your Category model
const sequelize = require("sequelize"); // Sequelize for MySQL queries

const ReturnReportService = async (Request) => {
    try {
        let UserEmail = Request.headers['email'];
        let FormDate = Request.body['FormDate'];
        let ToDate = Request.body['ToDate'];

        // Fetch total return amount for the given date range and UserEmail
        const totalReturnAmount = await ReturnProductsModel.sum('Total', {
            where: {
                UserEmail: UserEmail,
                CreatedDate: {
                    [sequelize.Op.gte]: new Date(FormDate),
                    [sequelize.Op.lte]: new Date(ToDate),
                }
            }
        });

        // Fetch return data with product, brand, and category information
        const returnData = await ReturnProductsModel.findAll({
            attributes: [
                'ProductID',
                'Total',
                'CreatedDate',
                [sequelize.fn('DATE_FORMAT', sequelize.col('CreatedDate'), '%Y-%m-%d'), 'FormattedDate'] // Format the date
            ],
            where: {
                UserEmail: UserEmail,
                CreatedDate: {
                    [sequelize.Op.gte]: new Date(FormDate),
                    [sequelize.Op.lte]: new Date(ToDate),
                }
            },
            include: [
                {
                    model: ProductModel,
                    attributes: ['Name', 'BrandID', 'CategoryID'], // Product info
                    include: [
                        {
                            model: BrandModel,
                            attributes: ['BrandName'],  // Brand info
                        },
                        {
                            model: CategoryModel,
                            attributes: ['CategoryName'],  // Category info
                        }
                    ]
                }
            ]
        });

        // Return the result
        return {
            status: "success",
            data: {
                totalReturnAmount,
                returnData
            }
        };

    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ReturnReportService;
