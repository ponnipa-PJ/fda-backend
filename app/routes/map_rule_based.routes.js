module.exports = app => {
const datas = require("../controllers/map_rule_based.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/findadanduser", datas.findadanduser);

router.get("/", datas.findAll);

router.get("/:id", datas.findOne);

router.put("/updateanswer/:id", datas.updateanswer);

router.put("/:id", datas.update);

router.put("/updatestatus/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/map_rule_based", router);
};