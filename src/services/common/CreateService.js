const CreateService = async (Request, DataModel) => {
   try {
       // Prepare the data to be inserted
       let PostBody = Request.body;
       PostBody.UserEmail = Request.headers['email']; // Add the UserEmail from request headers

       // Create the data record using Sequelize's `create` method
       const data = await DataModel.create(PostBody);

       // Return success response with the created data
       return { status: "success", data: data };
   } catch (error) {
       // Return failure response with the error
       return { status: "fail", data: error.toString() };
   }
};

module.exports = CreateService;
