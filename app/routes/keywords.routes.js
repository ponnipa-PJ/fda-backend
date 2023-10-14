module.exports = app => {
const datas = require("../controllers/keywords.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/", datas.findAll);

router.get("/:id", datas.findOne);

router.put("/updatedictid/:id", datas.updatedictid);

router.put("/:id", datas.update);

router.delete("/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/keywords", router);
};
