
const ExpenseReportService = require("../../services/report/ExpenseReportService");
const ReturnReportService = require("../../services/report/ReturnReportService");
const PurchaseReportService = require("../../services/report/PurchaseReportService");
const SalesReportService = require("../../services/report/SalesReportService");

const db = require("../../config/db"); // Assuming db connection is set up

// Expense Report by Date
exports.ExpensesByDate = async (req, res) => {
    const { startDate, endDate } = req.params; // Get date range from the URL or body
    try {
        let result = await ExpenseReportService(db, startDate, endDate);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Return Report by Date
exports.ReturnByDate = async (req, res) => {
    const { startDate, endDate } = req.params;
    try {
        let result = await ReturnReportService(db, startDate, endDate);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Purchase Report by Date
exports.PurchaseByDate = async (req, res) => {
    const { startDate, endDate } = req.params;
    try {
        let result = await PurchaseReportService(db, startDate, endDate);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// Sales Report by Date
exports.SalesByDate = async (req, res) => {
    const { startDate, endDate } = req.params;
    try {
        let result = await SalesReportService(db, startDate, endDate);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
