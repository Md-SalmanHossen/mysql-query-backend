const UpdateService = async (Request, DataModel) => {
   try {
       let UserEmail = Request.headers['email'];
       let id = Request.params.id;
       let PostBody = Request.body;

       // Use Sequelize's update method for updating a record
       let data = await DataModel.update(PostBody, {
           where: {
               id: id,            // The primary key of the record to update
               UserEmail: UserEmail,  // Ensuring that only the record owned by the user is updated
           }
       });

       if (data[0] === 0) {
           return { status: "fail", data: "No records updated" };
       }

       return { status: "success", data: data };

   } catch (error) {
       return { status: "fail", data: error.toString() };
   }
};

module.exports = UpdateService;
