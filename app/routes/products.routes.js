module.exports = app => {
const datas = require("../controllers/products.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/", datas.findAll);

router.get("/getdecision", datas.getdecision);

router.get("/getproductkeyword", datas.getproductkeyword);

router.get("/findGraphTwo", datas.findGraphTwo);

router.get("/findGraphOne", datas.findGraphOne);

router.post("/findproductfda", datas.findproductfda);

router.post("/findproduct", datas.findproduct);

router.post("/findscraping", datas.findscraping);

router.post("/findscrapingheader", datas.findscrapingheader);

router.get("/saveimageproduct", datas.saveimageproduct);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.put("/updatescraping/:id", datas.updatescraping);

router.put("/updatefdastatus/:id", datas.updatefdastatus);

router.put("/sentent_keyword/:id", datas.sentent_keyword);


router.put("/updatedeletestatus/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/products", router);
};
