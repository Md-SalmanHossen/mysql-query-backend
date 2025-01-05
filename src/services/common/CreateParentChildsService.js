const { Op } = require("sequelize");

const CreateParentChildsService = async (Request, ParentModel, ChildsModel, JoinPropertyName) => {
    // Start a Sequelize transaction
    const t = await ParentModel.sequelize.transaction();

    try {
        // First Database Process (Parent Creation)
        let Parent = Request.body['Parent'];
        Parent.UserEmail = Request.headers['email'];
        const ParentCreation = await ParentModel.create(Parent, { transaction: t });

        // Second Database Process (Child Creation)
        let Childs = Request.body['Childs'];
        Childs.forEach(element => {
            element[JoinPropertyName] = ParentCreation.id; // Assuming id is the primary key for ParentModel
            element.UserEmail = Request.headers['email'];
        });

        const ChildsCreation = await ChildsModel.bulkCreate(Childs, { transaction: t });

        // Commit Transaction if everything is successful
        await t.commit();

        return { status: "success", Parent: ParentCreation, Childs: ChildsCreation };
    } catch (error) {
        // Rollback the transaction if an error occurs
        await t.rollback();
        return { status: "fail", data: error.toString() };
    }
};

module.exports = CreateParentChildsService;
