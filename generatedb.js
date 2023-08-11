var fs = require("fs");

var table = "keywords"
var id = 'id'
var data = [
    'name','token','status'
]


//#region create folder
var dircontrollers = './app/controllers';
var dirmodels = './app/models';
var dirroutes = './app/routes';

if (!fs.existsSync(dircontrollers)) {
    fs.mkdirSync(dircontrollers);
}
if (!fs.existsSync(dirmodels)) {
    fs.mkdirSync(dirmodels);
}
if (!fs.existsSync(dirroutes)) {
    fs.mkdirSync(dirroutes);
}
//#endregion

var controllername = table + ".controller.js"
var modelname = table + ".model.js"
var routesname = table + ".routes.js"

//#region controller
var writeStream = fs.createWriteStream(dircontrollers + '/' + controllername);

//#region create

var pathmodel = 'const Data = require("' + '../models/' + modelname + '"' + ");"
writeStream.write(pathmodel);
writeStream.write("\r\n");
writeStream.write("\r\n");
var create = 'exports.create = (req, res) => {' + "\r\n" + "if (!req.body) {" + "\r\n" + "res.status(400).send({" + "\r\n" + "message: 'Content can not be empty!'" + "\r\n" +
    "});" + "\r\n" + '}' + "\r\n" + "\r\n" + "const datas = new Data({" + "\r\n"

for (let d = 0; d < data.length; d++) {
    create += data[d] + ':' + 'req.body.' + data[d] + ','
}

create += '});' + "\r\n"
create += 'Data.create(datas, (err, data) => {' + "\r\n"
create += 'if (err)' + "\r\n"
create += 'res.status(500).send({' + "\r\n"
create += 'message:' + "\r\n"
create += 'err.message || "Some error occurred while creating the Tutorial."' + "\r\n"
create += '});' + "\r\n"
create += 'else res.send(data);' + "\r\n"
create += '});' + "\r\n" + '};' + "\r\n" + "\r\n"
writeStream.write(create);

//#endregion

//#region getAll
var get = 'exports.findAll = (req, res) => {' + "\r\n"
get += 'const name = req.query.name;' + "\r\n"
get += 'Data.getAll(name, (err, data) => {' + "\r\n"
get += 'if (err)' + "\r\n"
get += 'res.status(500).send({' + "\r\n"
get += 'message:' + "\r\n"
get += 'err.message || "Some error occurred while retrieving table."' + "\r\n"
get += '});' + "\r\n"
get += 'else res.send(data);' + "\r\n"
get += '});' + "\r\n" + '};' + "\r\n"
writeStream.write(get);
//#endregion

//#region getOne
var getone = 'exports.findOne = (req, res) => {' + "\r\n"
getone += 'Data.findById(req.params.id, (err, data) => {' + "\r\n"
getone += 'if (err) {' + "\r\n"
getone += 'if (err.kind === "not_found") {' + "\r\n"
getone += 'res.send([])' + "\r\n"
getone += '}' + "\r\n"
getone += '} else res.send(data);' + "\r\n"
getone += '});' + "\r\n" + '};' + "\r\n"
writeStream.write(getone);
//#endregion

//#region update
var update = 'exports.update = (req, res) => {' + "\r\n" + "if (!req.body) {" + "\r\n" + "res.status(400).send({" + "\r\n" + "message: 'Content can not be empty!'" + "\r\n" +
    "});" + "\r\n" + '}' + "\r\n" + "\r\n"
update += 'Data.updateById(' + "\r\n"
update += 'req.params.id,' + "\r\n"
update += 'new Data(req.body),' + "\r\n"
update += '(err, data) => {' + "\r\n"
update += 'if (err) {' + "\r\n"
update += 'if (err.kind === "not_found") {' + "\r\n"
update += 'res.send([]);' + "\r\n" + '}' + "\r\n"
update += '} else res.send(data);' + "\r\n" + '}' + "\r\n" + ');' + "\r\n" + '};' + "\r\n" + "\r\n"
writeStream.write(update);

//#endregion

//#region deleteOne
var deleteone = 'exports.delete = (req, res) => {' + "\r\n"
deleteone += 'Data.remove(req.params.id, (err, data) => {' + "\r\n"
deleteone += 'if (err) {' + "\r\n"
deleteone += 'if (err.kind === "not_found") {' + "\r\n"
deleteone += 'res.send([])' + "\r\n"
deleteone += '}' + "\r\n"
deleteone += '} else res.send({ message: `Data was deleted successfully!` });' + "\r\n"
deleteone += '});' + "\r\n" + '};' + "\r\n" + "\r\n"
writeStream.write(deleteone);
//#endregion

//#region deleteAll
var deleteall = 'exports.deleteAll = (req, res) => {' + "\r\n"
deleteall += 'Data.removeAll((err, data) => {' + "\r\n"
deleteall += 'if (err)' + "\r\n"
deleteall += 'res.status(500).send({' + "\r\n"
deleteall += 'message:' + "\r\n"
deleteall += 'err.message || "Some error occurred while removing all tutorials."' + "\r\n"
deleteall += '});' + "\r\n"
deleteall += 'else res.send({ message: `All Datas was deleted successfully!` });' + "\r\n"
deleteall += '});' + "\r\n" + '};' + "\r\n" + "\r\n"
writeStream.write(deleteall);
//#endregion

writeStream.end();
//#endregion

//#region db
let path = dirmodels + '/db.js';

fs.lstat(path, (err, stats) => {

    if (err) {
        var writeStreamdb = fs.createWriteStream(dirmodels + '/db.js');
        var db = 'const mysql = require("mysql");' + "\r\n"
        db += 'const dbConfig = require("../config/db.config.js");' + "\r\n"
        db += 'const connection = mysql.createConnection({' + "\r\n"
        db += 'host: dbConfig.HOST,' + "\r\n"
        db += 'user: dbConfig.USER,' + "\r\n"
        db += 'password: dbConfig.PASSWORD,' + "\r\n"
        db += 'atabase: dbConfig.DB' + "\r\n"
        db += '});' + "\r\n" + "\r\n"
        db += 'connection.connect(error => {' + "\r\n"
        db += 'if (error)' + "\r\n"
        db += 'console.log("Successfully connected to the database.");' + "\r\n"
        db += '});' + "\r\n"
        db += 'connection.on("error", function(err) {' + "\r\n"
        db += 'console.log("[mysql error]",err);' + "\r\n"
        db += '});' + "\r\n"
        db += 'module.exports = connection;' + "\r\n"
        writeStreamdb.write(db);
        writeStreamdb.end();
    }  //Handle error

});


//#endregion

//#region model
var writeStreammodel = fs.createWriteStream(dirmodels + '/' + modelname);

//#region create

var pathmodel = 'const sql = require("./db");'
writeStreammodel.write(pathmodel);
writeStreammodel.write("\r\n");
writeStreammodel.write("\r\n");
var createmodel = 'const Data = function (datas) {' + "\r\n"

for (let d = 0; d < data.length; d++) {
    createmodel += 'this.' + data[d] + '=' + 'datas.' + data[d] + ';'
}

createmodel += '};' + "\r\n"
createmodel += 'Data.create = (newData, result) => {' + "\r\n"
createmodel += 'sql.query("INSERT INTO ' + table + ' SET ?", newData, (err, res) => {' + "\r\n"
createmodel += 'if (err) {' + "\r\n"
createmodel += 'result(err, null);' + "\r\n"
createmodel += 'return;' + "\r\n" + '}' + "\r\n"
createmodel += 'result(null, { id: res.insertId, ...newData });' + "\r\n"
createmodel += '});' + "\r\n"
createmodel += '}' + "\r\n" + "\r\n"

writeStreammodel.write(createmodel);

//#endregion

//#region getAll
var get = 'Data.getAll = (name, result) => {' + "\r\n"
get += 'let query = "SELECT * FROM ' + table + '";' + "\r\n"
get += 'if (name) {' + "\r\n"
get += 'query += ` WHERE name LIKE ' + "'%${name}%'`;" + "\r\n"
get += '}' + "\r\n" + 'sql.query(query, (err, res) => {' + "\r\n"
get += 'if (err) {' + "\r\n"
get += 'result(null, err);' + "\r\n"
get += 'return;' + "\r\n"
get += '}' + "\r\n"
get += 'result(null, res);' + "\r\n"
get += '});' + "\r\n" + '};' + "\r\n"
writeStreammodel.write(get);
//#endregion

//#region getOne
var getone = 'Data.findById = (id, result) => {' + "\r\n"
getone += 'sql.query(`SELECT * FROM ' + table + ' WHERE ' + id + ' = ${id}`, (err, res) => {' + "\r\n"
getone += 'if (err) {' + "\r\n"
getone += 'result(err, null);' + "\r\n"
getone += 'return;' + "\r\n"
getone += '}' + "\r\n"
getone += 'if (res.length) {' + "\r\n"
getone += 'result(null, res[0]);' + "\r\n" + 'return;' + "\r\n" + '}' + "\r\n"
getone += 'result({ kind: "not_found" }, null);' + "\r\n"
getone += '});' + "\r\n" + '};' + "\r\n" + "\r\n"

writeStreammodel.write(getone);
//#endregion

//#region update
var update = 'Data.updateById = (id, datas, result) => {' + "\r\n"
update += 'sql.query(' + "\r\n"
update += '"UPDATE ' + table + ' SET '

for (let d = 0; d < data.length; d++) {
    update += data[d] + ' = ' + '?,'
}
update = update.substring(0, update.length - 1);

update += ' WHERE ' + id + ' = ?",' + "\r\n"

update += '['
for (let d = 0; d < data.length; d++) {
    update += 'datas.' + data[d] + ','
}
update += id + '],'

update += '(err, res) => {' + "\r\n"
update += 'if (err) {' + "\r\n"
update += 'result(null, err);' + "\r\n"
update += 'return;' + "\r\n" + '}' + "\r\n"
update += 'if (res.affectedRows == 0) {' + "\r\n" + 'result({ kind: "not_found" }, null);' + "\r\n" + 'return;' + "\r\n" + '};'
update += 'result(null, { id: id, ...datas });' + "\r\n" + '}' + "\r\n" + ');' + "\r\n" + '};' + "\r\n"
writeStreammodel.write(update);

//#endregion

//#region deleteOne
var deleteone = 'Data.remove = (id, result) => {' + "\r\n"
deleteone += 'sql.query(' + "\r\n"
deleteone += '"DELETE FROM ' + table + '  WHERE ' + id + ' = ?",id, (err, res) => {' + "\r\n"
deleteone += 'if (err) {' + "\r\n"
deleteone += 'result(null, err);' + "\r\n"
deleteone += 'return;' + "\r\n"
deleteone += '}' + "\r\n"
deleteone += 'if (res.affectedRows == 0) {' + "\r\n"
deleteone += 'result({ kind: "not_found" }, null);' + "\r\n" + 'return;' + "\r\n" + '}' + "\r\n"
deleteone += 'result(null, res);' + "\r\n"
deleteone += '});' + "\r\n" + '};' + "\r\n" + "\r\n"
writeStreammodel.write(deleteone);
//#endregion

//#region deleteAll
var deleteall = 'Data.removeAll = result => {' + "\r\n"
deleteall += 'sql.query(' + '"DELETE FROM ' + table + '", (err, res) => {' + "\r\n"
deleteall += 'if (err) {' + "\r\n"
deleteall += 'result(null, err);' + "\r\n"
deleteall += 'return;' + "\r\n"
deleteall += '}' + "\r\n"
deleteall += 'result(null, res);' + "\r\n"
deleteall += '});' + "\r\n" + '};' + "\r\n" + "\r\n"
writeStreammodel.write(deleteall);
//#endregion

var endline = 'module.exports = Data;'
writeStreammodel.write(endline);

writeStreammodel.end();
//#endregion

//#region routes
var writeStreamroutes = fs.createWriteStream(dirroutes + '/' + routesname);

var createroutes = 'module.exports = app => {' + "\r\n"
createroutes += 'const datas = require("' + '../controllers/' + controllername + '"' + ");" + "\r\n" + "\r\n"

createroutes += 'var router = require("express").Router();' + "\r\n" + "\r\n"
createroutes += 'router.post("/", datas.create);' + "\r\n" + "\r\n"
createroutes += 'router.get("/", datas.findAll);' + "\r\n" + "\r\n"
createroutes += 'router.get("/:id", datas.findOne);' + "\r\n" + "\r\n"
createroutes += 'router.put("/:id", datas.update);' + "\r\n" + "\r\n"
createroutes += 'router.delete("/:id", datas.delete);' + "\r\n" + "\r\n"
createroutes += 'router.delete("/", datas.deleteAll);' + "\r\n" + "\r\n"
createroutes += 'app.use("/api/' + table + '", router);' + "\r\n" + '};' + "\r\n"

writeStreamroutes.write(createroutes);

//#endregion
