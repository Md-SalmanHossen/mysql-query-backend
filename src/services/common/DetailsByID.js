const db = require("../../config/db"); // Database connection

const DetailsByIDService = async (Request, tableName) => {
    try {
        const DetailsID = Request.params.id;
        const UserEmail = Request.headers['email'];

        // Check if the ID is valid
        if (!DetailsID || isNaN(DetailsID)) {
            return { status: "fail", data: "Invalid ID parameter." };
        }

        // Construct the query to fetch the details by ID and UserEmail
        const query = `SELECT * FROM ${tableName} WHERE id = ? AND UserEmail = ?`;

        // Execute the query and fetch the result
        const [rows] = await db.execute(query, [DetailsID, UserEmail]);

        // If no rows found, return an error message
        if (rows.length === 0) {
            return { status: "fail", data: "No records found for the given ID and UserEmail." };
        }

        return { status: "success", data: rows };
    } catch (error) {
        // Log the error for debugging
        console.error("Error in DetailsByIDService:", error);
        return { status: "fail", data: error.message };
    }
};

module.exports = DetailsByIDService;
