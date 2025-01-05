const { Op } = require("sequelize");

const ListTwoJoinService = async (Request, DataModel, SearchArray, JoinStage1, JoinStage2) => {
    try {
        let pageNo = Number(Request.params.pageNo);
        let perPage = Number(Request.params.perPage);
        let searchValue = Request.params.searchKeyword;
        let UserEmail = Request.headers['email'];
        let skipRow = (pageNo - 1) * perPage;

        let whereConditions = {
            UserEmail: UserEmail,
        };

        // If a search value is provided, create search conditions using Sequelize
        if (searchValue !== "0") {
            whereConditions[Op.or] = SearchArray.map(search => {
                return {
                    [Op.like]: `%${searchValue}%`
                };
            });
        }

        // Fetching paginated results with two joins
        let data = await DataModel.findAndCountAll({
            where: whereConditions,
            include: [
                JoinStage1,   // First join stage
                JoinStage2,   // Second join stage
            ],
            offset: skipRow,
            limit: perPage,
            distinct: true,  // Ensures that the count reflects unique results
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

module.exports = ListTwoJoinService;
