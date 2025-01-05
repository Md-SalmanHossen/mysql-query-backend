const CheckAssociateService = async (QueryObject, AssociateModel) => {
   try {
       // Find all records matching the query
       const data = await AssociateModel.findAll({
           where: QueryObject
       });

       // Return true if the data exists (i.e., matching records were found)
       return data.length > 0;

   } catch (error) {
       console.error('Error in CheckAssociateService:', error);
       return false;
   }
};

module.exports = CheckAssociateService;
