module.exports = app => {
    const cases = require("../controllers/menu.controller");
  
    var router = require("express").Router();
  
    // Create a new cases
    router.post("/", cases.create);
  
    // Retrieve all cases
    router.get("/", cases.findAll);

    router.get("/getdetailproduct", cases.getdetailproduct);
    
    // Retrieve a single cases with id
    router.get("/:id", cases.findOne);
  
    // Update a cases with id
    router.put("/:id", cases.update);
  
    // Delete a cases with id
    router.delete("/:id", cases.delete);
  
    // Delete all cases
    router.delete("/", cases.deleteAll);
  
    app.use('/api/menu', router);
  };