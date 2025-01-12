const CreateService = async (Request, tableName) => {
    try {
        const db = require("../../config/db"); // Database connection
        const PostBody = Request.body;
        PostBody.UserEmail = Request.headers['email']; // Add UserEmail from headers

        const keys = Object.keys(PostBody).join(","); // Create column names from keys
        const values = Object.values(PostBody); // Values from the PostBody
        const placeholders = values.map(() => "?").join(","); // Create placeholders for values

        // Create the SQL query for inserting data into the specified table
        const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;

        // Execute the query with the values
        const [result] = await db.execute(query, values);

        // Return a success response
        return { status: "success", data: result };
    } catch (error) {
        // Return a fail response in case of error
        return { status: "fail", data: error.message };
    }
};

module.exports = CreateService;
