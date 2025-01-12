const db = require("../../config/db"); // Database connection

const CreateParentChildsService = async (Request, ParentTableName, ChildTableName, JoinPropertyName) => {
    let transaction;

    try {
        // Start a transaction
        transaction = await db.getConnection(); // Get a DB connection to start transaction
        await transaction.beginTransaction();

        // Extract parent and child data from the request body
        const Parent = { ...Request.body['Parent'], UserEmail: Request.headers['email'] };

        // Prepare the parent insert query
        const parentKeys = Object.keys(Parent).join(",");
        const parentValues = Object.values(Parent);
        const parentPlaceholders = parentValues.map(() => "?").join(",");
        
        const parentQuery = `INSERT INTO ${ParentTableName} (${parentKeys}) VALUES (${parentPlaceholders})`;
        const [parentResult] = await transaction.execute(parentQuery, parentValues);

        // Prepare the child records and link to the parent ID
        const Childs = Request.body['Childs'].map((child) => ({
            ...child,
            [JoinPropertyName]: parentResult.insertId, // Use the parent's inserted ID
            UserEmail: Request.headers['email'],
        }));

        // Insert child records in bulk
        const childKeys = Object.keys(Childs[0]).join(",");
        const childPlaceholders = Childs.map(() => `(${Object.keys(Childs[0]).map(() => "?").join(",")})`).join(",");
        const childValues = Childs.flatMap(child => Object.values(child));

        const childQuery = `INSERT INTO ${ChildTableName} (${childKeys}) VALUES ${childPlaceholders}`;
        await transaction.execute(childQuery, childValues);

        // Commit the transaction
        await transaction.commit();

        return { status: "success", Parent: parentResult, Childs: childResult };
    } catch (error) {
        // Rollback the transaction if an error occurs
        if (transaction) await transaction.rollback();
        return { status: "fail", message: error.message };
    } finally {
        if (transaction) await transaction.release();
    }
};

module.exports = CreateParentChildsService;
