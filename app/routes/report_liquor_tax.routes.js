module.exports = app => {
    const cases = require("../controllers/report_liquor_tax.controller");
  
    var router = require("express").Router();
  
    // Create a new cases
    router.post("/", cases.create);
  
    // Retrieve all cases
    router.get("/", cases.findAll);
    
    // Retrieve all cases
    router.get("/type/", cases.findType);

    // Retrieve all cases
    router.get("/merge/", cases.mergeAll);
  
    // Retrieve a single cases with id
    router.get("/:id", cases.findOne);
  
    // Update a cases with id
    router.put("/:id", cases.update);
  
    // Delete a cases with id
    router.delete("/:id", cases.delete);
  
    // Delete all cases
    router.delete("/", cases.deleteAll);
  
    app.use('/api/report_liquor_tax', router);
  };