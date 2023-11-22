module.exports = app => {
const datas = require("../controllers/keyword_dicts.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/", datas.findAll);

router.get("/gettraining", datas.gettraining);

router.get("/mapdictId", datas.mapdictId);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.delete("/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/keyword_dicts", router);
};
