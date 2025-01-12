const db = require('../../config/db'); // Database connection

const ListOneJoinService = async (Request, tableName, SearchArray, JoinStage) => {
    try {
        let pageNo = Math.max(1, Number(Request.params.pageNo));  // Ensure pageNo is at least 1
        let perPage = Math.max(1, Number(Request.params.perPage));  // Ensure perPage is at least 1
        let searchValue = Request.params.searchKeyword !== "0" ? Request.params.searchKeyword : "";
        let UserEmail = Request.headers['email'];
        let skipRow = (pageNo - 1) * perPage;

        // Building the search query dynamically for raw SQL
        let searchQuery = "";
        if (searchValue) {
            searchQuery = SearchArray.map((field) => {
                return `${field} LIKE ?`;
            }).join(" OR ");
        }

        // Constructing the base query and the join stage query
        let baseQuery = `SELECT * FROM ${tableName} WHERE UserEmail = ?`;
        let countQuery = `SELECT COUNT(*) AS Total FROM ${tableName} WHERE UserEmail = ?`;
        let joinQuery = "";

        // Prepare join part of the query (you can pass join conditions in JoinStage)
        if (JoinStage && Array.isArray(JoinStage) && JoinStage.length > 0) {
            joinQuery = JoinStage.map(join => {
                return `LEFT JOIN ${join.tableName} AS ${join.alias} ON ${join.onCondition}`;
            }).join(" ");
        }

        // Apply the search query if provided
        if (searchQuery) {
            baseQuery += ` AND (${searchQuery})`;
        }

        // Add limit and offset for pagination
        baseQuery += ` LIMIT ? OFFSET ?`;

        // Final values to be passed in the query
        const values = [
            UserEmail,
            ...Array(SearchArray.length).fill(`%${searchValue}%`),
            perPage,
            skipRow
        ];

        // Count query to get total count for pagination
        const [countRows] = await db.execute(countQuery, [UserEmail]);

        // Final query execution
        const [rows] = await db.execute(`${baseQuery} ${joinQuery}`, values);

        return {
            status: "success",
            data: {
                Total: countRows[0].Total,
                Rows: rows,
            }
        };
    } catch (error) {
        console.error(error);  // Log error for debugging purposes
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ListOneJoinService;
