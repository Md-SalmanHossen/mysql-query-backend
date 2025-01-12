const ListService = async (Request, tableName, SearchFields) => {
    try {
        const db = require("../../config/db");
        const pageNo = Number(Request.params.pageNo);
        const perPage = Number(Request.params.perPage);
        const searchValue = Request.params.searchKeyword;
        const UserEmail = Request.headers['email'];
        const offset = (pageNo - 1) * perPage;

        let searchQuery = "";
        if (searchValue !== "0") {
            searchQuery = SearchFields.map((field) => `${field} LIKE ?`).join(" OR ");
        }

        const baseQuery = `SELECT * FROM ${tableName} WHERE UserEmail = ?`;
        const countQuery = `SELECT COUNT(*) AS Total FROM ${tableName} WHERE UserEmail = ?`;

        const whereClause = searchQuery ? ` AND (${searchQuery})` : "";
        const finalQuery = `${baseQuery}${whereClause} LIMIT ? OFFSET ?`;

        const values = [
            UserEmail,
            ...Array(SearchFields.length).fill(`%${searchValue}%`),
            perPage,
            offset,
        ];

        const [rows] = await db.execute(finalQuery, values);
        const [totalCount] = await db.execute(countQuery, [UserEmail]);

        return {
            status: "success",
            data: {
                Total: totalCount[0].Total,
                Rows: rows,
            },
        };
    } catch (error) {
        return { status: "fail", data: error.message };
    }
};

module.exports = ListService;
