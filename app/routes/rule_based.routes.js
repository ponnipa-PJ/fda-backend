module.exports = app => {
const datas = require("../controllers/rule_based.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/getcolumn", datas.getcolumn);

router.get("/createcolumn", datas.createcolumn);

router.get("/", datas.findAll);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.delete("/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/rule_based", router);
};
