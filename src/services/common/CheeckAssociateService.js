const db = require("../../config/db"); // Database connection

const CheckAssociateService = async (QueryObject, TableName) => {
    try {
        // Build the WHERE clause from the QueryObject
        const whereConditions = Object.keys(QueryObject)
            .map(key => `${key} = ?`)
            .join(" AND ");
        
        const values = Object.values(QueryObject);

        // Construct the query to count matching records
        const query = `SELECT COUNT(*) AS count FROM ${TableName} WHERE ${whereConditions}`;
        
        // Execute the query with the values
        const [result] = await db.execute(query, values);

        // Return true if at least one record exists
        return result[0].count > 0;
    } catch (error) {
        console.error('Error in CheckAssociateService:', error.message);
        return false;
    }
};

module.exports = CheckAssociateService;
