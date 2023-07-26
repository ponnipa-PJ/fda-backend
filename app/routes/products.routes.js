module.exports = app => {
const datas = require("../controllers/products.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/", datas.findAll);

router.post("/findproduct", datas.findproduct);

router.post("/findscraping", datas.findscraping);

router.post("/findscrapingheader", datas.findscrapingheader);

router.post("/saveimageproduct", datas.saveimageproduct);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.put("/updatescraping/:id", datas.updatescraping);

router.put("/updatefdastatus/:id", datas.updatefdastatus);


router.put("/updatedeletestatus/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/products", router);
};
