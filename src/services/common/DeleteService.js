const DeleteService = async (Request, Model) => {
   try {
       let DeleteID = Request.params.id;
       let UserEmail = Request.headers['email'];

       // Query object to match based on ID and UserEmail
       let QueryObject = {};
       QueryObject.id = DeleteID; // Assuming the primary key is 'id'
       QueryObject.UserEmail = UserEmail;

       // Delete the record
       let Delete = await Model.destroy({
           where: QueryObject,
       });

       return { status: "success", Delete };

   } catch (error) {
       return { status: "fail", data: error.toString() };
   }
};

module.exports = DeleteService;
