module.exports = app => {
const datas = require("../controllers/dashboard.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/", datas.findAll);

router.get("/gettypeone/", datas.gettypeone);

router.get("/gettypetwo/", datas.gettypetwo);

router.get("/gettypethree/", datas.gettypethree);

router.get("/getdetailtype/:id", datas.getdetailtype);

router.get("/getexcelbyid/:id", datas.getexcelbyid);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.delete("/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/dashboard", router);
};
