const db = require("../../config/db"); // Database connection

const DropDownService = async (Request, tableName, Projection) => {
    try {
        const UserEmail = Request.headers['email'];

        // Ensure Projection is an array and join the fields properly for the SQL query
        if (!Array.isArray(Projection)) {
            return { status: "fail", data: "Projection should be an array of fields." };
        }

        const fields = Projection.join(",");  // Convert array to comma-separated string for SQL
        const query = `SELECT ${fields} FROM ${tableName} WHERE UserEmail = ?`;

        // Execute query to fetch the dropdown data
        const [rows] = await db.execute(query, [UserEmail]);

        // Check if rows are found
        if (rows.length === 0) {
            return { status: "fail", data: "No data found." };
        }

        return { status: "success", data: rows };
    } catch (error) {
        // Log the error for debugging
        console.error("Error in DropDownService:", error);
        return { status: "fail", data: error.message };
    }
};

module.exports = DropDownService;
