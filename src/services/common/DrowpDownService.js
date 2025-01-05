const DropDownService = async (Request, DataModel, Projection) => {
   try {
       let UserEmail = Request.headers['email'];

       // Assuming 'Projection' is an array of fields you want to include
       let selectedFields = Projection.reduce((acc, field) => {
           acc[field] = true;
           return acc;
       }, {});

       // Fetching data from the database, filtered by UserEmail
       let data = await DataModel.findAll({
           where: {
               UserEmail: UserEmail
           },
           attributes: Object.keys(selectedFields),  // Project specific fields
       });

       return { status: "success", data: data };

   } catch (error) {
       return { status: "fail", data: error.toString() };
   }
};

module.exports = DropDownService;
