const db = require("../../config/db"); // Database connection

const UpdateService = async (Request, tableName) => {
    try {
        const UserEmail = Request.headers['email'];
        const id = Request.params.id;
        const PostBody = Request.body;

        // Validation: Ensure email, id, and PostBody are provided
        if (!UserEmail || !id || !PostBody || Object.keys(PostBody).length === 0) {
            return { status: "fail", data: "Invalid request. Missing required fields." };
        }

        // Sanitize table name (ensure it's a valid table name)
        const validTableNames = ['table1', 'table2', 'table3']; // Replace with actual valid table names
        if (!validTableNames.includes(tableName)) {
            return { status: "fail", data: "Invalid table name." };
        }

        // Build the update query dynamically
        const updates = Object.keys(PostBody)
            .map((key) => `${key} = ?`)
            .join(",");
        
        // Ensure that we include the UserEmail and id in the query parameters for security
        const values = [...Object.values(PostBody), UserEmail, id];

        // Construct the query
        const query = `UPDATE ${tableName} SET ${updates} WHERE id = ? AND UserEmail = ?`;
        
        // Execute the query
        const [result] = await db.execute(query, values);

        // Check if any records were updated
        if (result.affectedRows === 0) {
            return { status: "fail", data: "No records updated." };
        }

        // Return success if the update was successful
        return { status: "success", data: result };

    } catch (error) {
        // Handle any unexpected errors
        console.error(error); // Log the error for debugging purposes
        return { status: "fail", data: error.message };
    }
};

module.exports = UpdateService;
