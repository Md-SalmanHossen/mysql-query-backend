const express = require('express');
const app = express();
const router = require('./src/routes/api.js');
const db = require('./src/config/db.js'); // Ensure only this is used consistently

// Import Table Creation Queries
const { createTableQuery } = require('./src/models/users/UserModel.js');
const { createOtpTableQuery } = require('./src/models/users/OTPModel.js');
const { createSupplierTable } = require('./src/models/suppliers/SuppliersModel.js');
const { createSalesTable } = require('./src/models/sells/SalesModel.js');
const { createSalesProduct } = require('./src/models/sells/SalesProductsModel.js');

const { createReturnProductTable } = require('./src/models/returns/ReturnProductsModel');
const { createReturnTable } = require('./src/models/returns/ReturnsModel.js');
const { createPurchesTable } = require('./src/models/purches/PurchesModel.js');
const { createPurchesProduct } = require('./src/models/purches/PurchesProductModel.js');
const { createProductTable } = require('./src/models/product/ProductsModel.js');

const { createExpenseTable } = require('./src/models/expense/ExpenseModel.js');
const { createExpenseTypes } = require('./src/models/expense/ExpenseTypesModel.js');
const { createCustomerTable } = require('./src/models/customer/CustomersModel.js');
const { createCategoryTable } = require('./src/models/category/CategoriesModel.js');
const { createBrandTable } = require('./src/models/brands/BrandsModel.js');

// Security imports
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true })); // Replace undefined with true or false

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use(limiter);

// Test database connection
const initializeDatabase = async () => {
  let connection;
  try {
    connection = await db.getConnection(); // Get connection from pool
    console.log('Database connected successfully!');

    // Log and check if queries are defined
    if (!createTableQuery) throw new Error("createTableQuery is undefined");
    await connection.execute(createTableQuery);

    if (!createCustomerTable) throw new Error("createCustomerTable is undefined");
    await connection.execute(createCustomerTable);

    if (!createOtpTableQuery) throw new Error("createOtpTableQuery is undefined");
    await connection.execute(createOtpTableQuery);

    if (!createSupplierTable) throw new Error("createSupplierTable is undefined");
    await connection.execute(createSupplierTable);

    if (!createCategoryTable) throw new Error("createCategoryTable is undefined");
    await connection.execute(createCategoryTable);

    if (!createBrandTable) throw new Error("createBrandTable is undefined");
    await connection.execute(createBrandTable);

    if (!createProductTable) throw new Error("createProductTable is undefined");
    await connection.execute(createProductTable);

    if (!createReturnTable) throw new Error("createReturnTable is undefined");
    await connection.execute(createReturnTable);
    
    if (!createSalesTable) throw new Error("createSalesTable is undefined");
    await connection.execute(createSalesTable);

    if (!createSalesProduct) throw new Error("createSalesProduct is undefined");
    await connection.execute(createSalesProduct);

    if (!createReturnProductTable) throw new Error("createReturnProductTable is undefined");
    await connection.execute(createReturnProductTable);

    if (!createPurchesTable) throw new Error("createPurchesTable is undefined");
    await connection.execute(createPurchesTable);

    if (!createPurchesProduct) throw new Error("createPurchesProduct is undefined");
    await connection.execute(createPurchesProduct);

    if (!createExpenseTypes) throw new Error("createExpenseTypes is undefined");
    await connection.execute(createExpenseTypes);

    if (!createExpenseTable) throw new Error("createExpenseTable is undefined");
    await connection.execute(createExpenseTable);
  } catch (error) {
    console.error("Error during table creation:", error.message);
  } finally {
    if (connection) connection.release(); // Always release the connection back to the pool
  }
};


// Initialize database on startup
initializeDatabase();



// Routing
app.use('/api/v1', router);

// Undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ status: 'fail', data: 'not found' });
});

module.exports = app;
