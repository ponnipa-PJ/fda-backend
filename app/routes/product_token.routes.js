module.exports = app => {
const datas = require("../controllers/product_token.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.post("/getmapproduct/", datas.getmapproduct);

router.post("/getproductkeyword/", datas.getproductkeyword);

router.post("/getproduct/", datas.getproduct);

router.post("/getproducttest/", datas.getproducttest);

router.post("/getbestrulebased/", datas.getbestrulebased);

router.get("/", datas.findAll);

router.get("/findAlltest", datas.findAlltest);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.put("/updatemap/:id", datas.updatemap);

router.delete("/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/product_token", router);
};
