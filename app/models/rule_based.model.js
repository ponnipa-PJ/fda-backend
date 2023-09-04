const sql = require("./db");

const Data = function (datas) {
    
    this.datas=datas}
Data.create = (newData, result) => {
sql.query("INSERT INTO rule_based SET ?", newData.datas.data, (err, res) => {
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.createcolumn = (name, result) => {
    let query = `ALTER TABLE rule_based ADD dict${name} int(11) NOT NULL DEFAULT(0)`;
    console.log(query);
    sql.query(query, (err, res) => {
    if (err) {
    result(null, err);
    return;
    }
    result(null, res);
    });
    };

Data.getcolumn = (name, result) => {
    let query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'rule_based'";
    if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
    }
    sql.query(query, (err, res) => {
    if (err) {
    result(null, err);
    return;
    }
    result(null, res);
    });
    };
Data.getAll = (name, result) => {
let query = "SELECT * FROM rule_based";
if (name) {
query += ` WHERE name LIKE '%${name}%'`;
}
sql.query(query, (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};
Data.findById = (id, result) => {
sql.query(`SELECT * FROM rule_based WHERE id = ${id}`, (err, res) => {
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
"UPDATE rule_based SET answer = ? WHERE id = ?",
[datas.answer,id],(err, res) => {
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
"DELETE FROM rule_based  WHERE id = ?",id, (err, res) => {
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
sql.query("DELETE FROM rule_based", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;