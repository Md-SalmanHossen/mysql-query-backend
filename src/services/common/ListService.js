const db = require("../../config/db"); // Database connection

const ListService = async (Request, tableName, SearchFields) => {
    try {
        // Validate pagination parameters
        const pageNo = Math.max(1, Number(Request.params.pageNo)); // Ensure pageNo is at least 1
        const perPage = Math.max(1, Number(Request.params.perPage)); // Ensure perPage is at least 1

        // Sanitize and validate the search keyword
        const searchValue = Request.params.searchKeyword !== "0" ? Request.params.searchKeyword : "";

        // Validate table name (you can define a list of allowed table names for extra security)
        const validTableNames = ['table1', 'table2', 'table3']; // Replace with actual valid tables
        if (!validTableNames.includes(tableName)) {
            return { status: "fail", data: "Invalid table name." };
        }

        const offset = (pageNo - 1) * perPage;

        // Build dynamic search query if search keyword is provided
        let searchQuery = "";
        if (searchValue) {
            searchQuery = SearchFields.map((field) => `${field} LIKE ?`).join(" OR ");
        }

        const baseQuery = `SELECT * FROM ${tableName} WHERE UserEmail = ?`;
        const countQuery = `SELECT COUNT(*) AS Total FROM ${tableName} WHERE UserEmail = ?`;

        const whereClause = searchQuery ? ` AND (${searchQuery})` : "";
        const finalQuery = `${baseQuery}${whereClause} LIMIT ? OFFSET ?`;

        // Prepare query values
        const values = [
            Request.headers['email'],
            ...Array(SearchFields.length).fill(`%${searchValue}%`),
            perPage,
            offset,
        ];

        // Execute queries
        const [rows] = await db.execute(finalQuery, values);
        const [totalCount] = await db.execute(countQuery, [Request.headers['email']]);

        // Return the result
        return {
            status: "success",
            data: {
                Total: totalCount[0].Total,
                Rows: rows,
            },
        };
    } catch (error) {
        console.error(error); // Log error for debugging purposes
        return { status: "fail", data: error.message };
    }
};

module.exports = ListService;
