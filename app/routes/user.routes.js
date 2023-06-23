module.exports = app => {
    const cases = require("../controllers/user.controller");
  
    var router = require("express").Router();
  
    // Create a new cases
    router.post("/", cases.create);
  
    // Create a new User
    router.post("/signin", cases.signin);

    // Retrieve all cases
    router.get("/", cases.findAll);

    // Retrieve all cases
    router.get("/findKey/", cases.findKey);
    
    // Retrieve a single cases with id
    router.get("/:id", cases.findOne);
  
    // Update a cases with id
    router.put("/:id", cases.update);
  
    // Delete a cases with id
    router.delete("/:id", cases.delete);
  
    // Delete all cases
    router.delete("/", cases.deleteAll);
  
    app.use('/api/user', router);
  };