const { Op } = require("sequelize");

const ListOneJoinService = async (Request, DataModel, SearchArray, JoinStage) => {
    try {
        let pageNo = Number(Request.params.pageNo);
        let perPage = Number(Request.params.perPage);
        let searchValue = Request.params.searchKeyword;
        let UserEmail = Request.headers['email'];
        let skipRow = (pageNo - 1) * perPage;

        let whereConditions = {
            UserEmail: UserEmail,
        };

        // Prepare search query for Sequelize using "Op.or" for multiple conditions
        if (searchValue !== "0") {
            whereConditions[Op.or] = SearchArray.map(search => {
                return {
                    [Op.like]: `%${searchValue}%`
                };
            });
        }

        // Fetching paginated results with the join included
        let data = await DataModel.findAndCountAll({
            where: whereConditions,
            include: JoinStage,  // This is where your join logic would go
            offset: skipRow,
            limit: perPage,
            distinct: true,  // Ensures counting distinct results
            raw: false,      // Retrieve model instances, not plain data
        });

        return {
            status: "success",
            data: {
                Total: data.count,
                Rows: data.rows,
            }
        };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ListOneJoinService;
