const { Op } = require("sequelize");

const DeleteParentChildsService = async (Request, ParentModel, ChildsModel, JoinPropertyName) => {
    try {
        // Start a transaction
        const transaction = await ParentModel.sequelize.transaction();

        let DeleteID = Request.params.id;
        let UserEmail = Request.headers['email'];

        // Parent and Child Query objects
        let ChildQueryObject = {};
        ChildQueryObject[JoinPropertyName] = DeleteID;
        ChildQueryObject.UserEmail = UserEmail;

        let ParentQueryObject = {};
        ParentQueryObject.id = DeleteID; // Assuming the primary key is 'id'
        ParentQueryObject.UserEmail = UserEmail;

        // First Process: Delete child records
        let ChildsDelete = await ChildsModel.destroy({
            where: ChildQueryObject,
            transaction,
        });

        // Second Process: Delete parent record
        let ParentDelete = await ParentModel.destroy({
            where: ParentQueryObject,
            transaction,
        });

        // Commit the transaction
        await transaction.commit();

        return { status: "success", Parent: ParentDelete, Childs: ChildsDelete };

    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) await transaction.rollback();
        return { status: "fail", data: error.toString() };
    }
};

module.exports = DeleteParentChildsService;
