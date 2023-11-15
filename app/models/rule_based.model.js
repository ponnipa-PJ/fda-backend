const sql = require("./db");

const Data = function (datas) {
this.map_rule_based_id=datas.map_rule_based_id;this.dict_id=datas.dict_id;this.dict_name=datas.dict_name;this.no=datas.no;};
Data.create = (newData, result) => {
sql.query("INSERT INTO rule_based SET ?", newData, (err, res) => {
    console.log(err);
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.getAll = (name, result) => {
let query = "SELECT * FROM `map_rule_based`";
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
Data.getweightrulebasemax = (name, result) => {
    let query = "SELECT MAX(weight) as max FROM map_rule_based LIMIT 1;";
    if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
    }
    sql.query(query, (err, res) => {
    if (err) {
    result(null, err);
    return;
    }
    result(null, res[0]);
    });
    };
    Data.getweightkeywordmax = (name, result) => {
        let query = "SELECT MAX(weight) as max FROM keyword_dicts LIMIT 1;";
        if (name) {
        query += ` WHERE name LIKE '%${name}%'`;
        }
        sql.query(query, (err, res) => {
        if (err) {
        result(null, err);
        return;
        }
        result(null, res[0]);
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
Data.getbydict = (name, result) => {
    let query = name
    // console.log(query);
    sql.query(query, (err, res) => {
    if (err) {
    result(null, err);
    return;
    }
    result(null, res);
    });
    };
Data.updateById = (id, datas, result) => {
sql.query(
"UPDATE rule_based SET map_rule_based_id = ?,dict_id = ?,no = ? WHERE id = ?",
[datas.map_rule_based_id,datas.dict_id,datas.no,id],(err, res) => {
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