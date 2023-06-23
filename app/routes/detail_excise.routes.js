module.exports = app => {
    const cases = require("../controllers/detail_excise.controller");
  
    var router = require("express").Router();
  
    // Create a new cases
    router.post("/", cases.create);
  
    // Retrieve all cases
    router.get("/", cases.findAll);
    // Retrieve all cases
    router.get("/getExciseNo", cases.findExciseNo);

    router.get("/getmap", cases.findMapAll);

        // Retrieve all cases
        router.get("/count", cases.findCount);

    // Retrieve all cases
    router.get("/latnull/", cases.findNull);
  
    // Retrieve a single cases with id
    router.get("/exiseno/:id", cases.findOneExciseNo);

    
    // Retrieve a single cases with id
    router.get("/countall/", cases.findCountAll);
  
    // Retrieve a single cases with id
    router.get("/:id", cases.findOne);

    // Retrieve a single cases with id
    router.get("/getbyID/:id", cases.findById);
  
    // Update a cases with id
    router.put("/image/:id", cases.updateImage);

    // Update a cases with id
    router.put("/:id", cases.update);
  
    // Delete a cases with id
    router.delete("/:id", cases.delete);
  
    // Delete all cases
    router.delete("/", cases.deleteAll);
  
    app.use('/api/detail_excise', router);
  };