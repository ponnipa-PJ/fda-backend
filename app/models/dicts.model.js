const sql = require("./db");

const Data = function (datas) {
this.name=datas.name;this.status=datas.status;};
Data.create = (newData, result) => {

sql.query("INSERT INTO dicts SET ?", newData, (err, res) => {
if (err) {
    result(null, { id: res.insertId, ...newData });
return;
}
// let rule = `ALTER TABLE rule_based ADD dict${res.insertId} int(11) NOT NULL DEFAULT(0)`;
// sql.query(rule, (err, rules) => {
// result(null, { id: res.insertId, ...newData });
// });
})
}

Data.getAll = (status,name, result) => {
let query = "SELECT * FROM dicts";
if (status) {
query += ` WHERE status = ${status}`;
}
if (name) {
    query += ` WHERE name = '${name}'`;
    }
    // console.log(query);
sql.query(query, (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};
Data.findById = (id, result) => {
sql.query(`SELECT * FROM dicts WHERE id = ${id}`, (err, res) => {
if (err) {
result(err, null);
return;
}
if (res.length) {
result(null, res[0]);
return;
}
result({ kind: "not_found" }, null);
});
};

Data.updateById = (id, datas, result) => {
sql.query(
"UPDATE dicts SET name = ? WHERE id = ?",
[datas.name,id],(err, res) => {
if (err) {
result(null, err);
return;
}
if (res.affectedRows == 0) {
result({ kind: "not_found" }, null);
return;
};result(null, { id: id, ...datas });
}
);
};
Data.remove = (id, result) => {
sql.query(
"UPDATE dicts set status = 0 WHERE id = ?",id, (err, res) => {
if (err) {
result(null, err);
return;
}
if (res.affectedRows == 0) {
result({ kind: "not_found" }, null);
return;
}
result(null, res);
});
};

Data.removeAll = result => {
sql.query("DELETE FROM dicts", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;