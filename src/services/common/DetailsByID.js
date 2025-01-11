const DetailsByIDService = async (Request, DataModel) => {
   try {
       let DetailsID = Request.params.id;
       let UserEmail = Request.headers['email'];

       // Query object to match based on ID and UserEmail
       let QueryObject = {};
       QueryObject.id = DetailsID; // Assuming the primary key is 'id'
       QueryObject.UserEmail = UserEmail;

       // Find the record by ID and UserEmail
       let data = await DataModel.findAll({
           where: QueryObject,
       });

       // Return the result
       return { status: "success", data: data };

   } catch (error) {
       return { status: "fail", data: error.toString() };
   }
};

module.exports = DetailsByIDService;
