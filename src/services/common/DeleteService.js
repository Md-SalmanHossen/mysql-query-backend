const db = require("../../config/db"); // Database connection

const DeleteService = async (Request, tableName) => {
    try {
        const DeleteID = Request.params.id;
        const UserEmail = Request.headers['email'];

        // Check if the ID is valid
        if (!DeleteID || isNaN(DeleteID)) {
            return { status: "fail", data: "Invalid ID parameter." };
        }

        // Construct the delete query
        const query = `DELETE FROM ${tableName} WHERE id = ? AND UserEmail = ?`;

        // Execute the delete query
        const [result] = await db.execute(query, [DeleteID, UserEmail]);

        // If no rows were affected, return a failure message
        if (result.affectedRows === 0) {
            return { status: "fail", data: "No records found to delete with the given ID and UserEmail." };
        }

        return { status: "success", data: "Record deleted successfully." };
    } catch (error) {
        // Log the error for debugging
        console.error("Error in DeleteService:", error);
        return { status: "fail", data: error.message };
    }
};

module.exports = DeleteService;
