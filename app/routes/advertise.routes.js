module.exports = app => {
const datas = require("../controllers/advertise.controller.js");

var router = require("express").Router();

router.post("/", datas.create);

router.get("/", datas.findAll);

router.get("/getkeyword", datas.getkeyword);

router.get("/:id", datas.findOne);

router.put("/:id", datas.update);

router.put("/updaterulebased/:id", datas.updaterulebased);

router.delete("/:id", datas.delete);

router.delete("/", datas.deleteAll);

app.use("/api/advertise", router);
};
