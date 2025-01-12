const db = require("../../config/db"); // Database connection

const DeleteParentChildsService = async (Request, ParentTable, ChildTable, JoinPropertyName) => {
    let transaction; // Define the transaction variable
    try {
        // Start a transaction
        transaction = await db.getConnection();

        const DeleteID = Request.params.id;
        const UserEmail = Request.headers['email'];

        // Start the transaction
        await transaction.beginTransaction();

        // Delete child records
        const deleteChildQuery = `DELETE FROM ${ChildTable} WHERE ${JoinPropertyName} = ? AND UserEmail = ?`;
        const [childDeleteResult] = await transaction.execute(deleteChildQuery, [DeleteID, UserEmail]);

        // If no child records were deleted, log it
        if (childDeleteResult.affectedRows === 0) {
            console.log(`No child records found for deletion with ID ${DeleteID} and UserEmail ${UserEmail}`);
        }

        // Delete parent record
        const deleteParentQuery = `DELETE FROM ${ParentTable} WHERE id = ? AND UserEmail = ?`;
        const [parentDeleteResult] = await transaction.execute(deleteParentQuery, [DeleteID, UserEmail]);

        // If no parent record was deleted, log it
        if (parentDeleteResult.affectedRows === 0) {
            console.log(`No parent record found for deletion with ID ${DeleteID} and UserEmail ${UserEmail}`);
        }

        // Commit the transaction
        await transaction.commit();

        // Return success with details of deleted records
        return {
            status: "success",
            data: {
                ParentDeleted: parentDeleteResult.affectedRows,
                ChildsDeleted: childDeleteResult.affectedRows,
            },
        };
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) await transaction.rollback();

        // Log the error for better understanding
        console.error("Error in DeleteParentChildsService:", error.message);

        return { status: "fail", message: error.message };
    }
};

module.exports = DeleteParentChildsService;
