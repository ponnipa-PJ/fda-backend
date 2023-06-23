module.exports = app => {
    const cases = require("../controllers/merge_liquor_report.controller");

    var router = require("express").Router();

    // Create a new cases
    router.post("/", cases.create);

    // Retrieve all cases
    router.get("/", cases.findAll);

    router.get("/getdatagraph", cases.getdatagraph);
    

    router.get("/getvolumetax", cases.getvolumetax);
    
    router.get("/getaxlist", cases.getaxlist);
    router.get("/getnettax", cases.getnettax);
    router.get("/getnumber", cases.getnumber);
    router.get("/getvolume", cases.getvolume);
    
    router.get("/getlisttax", cases.getlisttax);

    router.get("/getabletax", cases.getabletax);

    // Retrieve all cases
    router.get("/type/", cases.findType);

    // Retrieve all cases
    router.get("/sortdate/", cases.sortdate);

     // Retrieve all cases
     router.get("/getnottax/", cases.findnottax);

     router.get("/getsumall/", cases.getsumall);

    // Retrieve all cases
    router.get("/getfromdate/", cases.fromdatedetailtax);

    // Retrieve all cases
    router.get("/getdetailtax/", cases.detailtax);

    // Retrieve all cases
    router.get("/getheader/", cases.liquortaxheader);

    // Retrieve all cases
    router.get("/liquortaxdetail/", cases.liquortaxdetail);

    // Retrieve a single cases with id
    router.get("/graph/:id", cases.findGraph);
    router.get("/getoverall", cases.getoverall);
    router.get("/getnetall", cases.getnetall);
    

    // Retrieve a single cases with id
    router.get("/value/:id", cases.findValue);

    // Retrieve a single cases with id
    router.get("/:id", cases.findOne);

    // Update a cases with id
    router.put("/:id", cases.update);

    // Delete a cases with id
    router.delete("/:id", cases.delete);

    // Delete all cases
    router.delete("/", cases.deleteAll);

    app.use('/api/merge_liquor_report', router);
};