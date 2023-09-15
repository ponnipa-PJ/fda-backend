const sql = require("./db");

const Data = function (datas) {
this.product_id=datas.product_id;this.keyword_id=datas.keyword_id;};
Data.create = (newData, result) => {
sql.query("INSERT INTO rule_based_keyword SET ?", newData, (err, res) => {
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.getAll = (name, result) => {
    list= []
let query = "SELECT k.*,c.name as category FROM rule_based_keyword k left join products p on k.product_id = p.id left join category c on c.id = p.cat_id order by k.product_id";
if (name) {
query += ` WHERE name LIKE '%${name}%'`;
}
sql.query(query, (err, res) => {
    for (let r = 0; r < res.length; r++) {
        res[r].keyword_id = JSON.parse(res[r].keyword_id);
        key = []
        res[r].no = res[r].keyword_id.length
        for (let k = 0; k < res[r].keyword_id.length; k++) {
            let getkeyword = `SELECT * FROM keyword_dicts WHERE id = ${res[r].keyword_id[k]}`;
            sql.query(getkeyword, (err, keyword) => {
                key.push(keyword[0].name
                )
            if (k+1 == res[r].no) {
                res[r].data = key
                key = []
            }
        });
        }
       
        

        if (r+1 == res.length) {
            list = res
        }
    }
if (err) {
result(null, err);
return;
}
setTimeout(() => {

    result(null, list);
}, 500);
});
};
Data.findById = (id, result) => {
sql.query(`SELECT * FROM rule_based_keyword WHERE product_id = ${id}`, (err, res) => {
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
"UPDATE rule_based_keyword SET product_id = ?,keyword_id = ? WHERE id = ?",
[datas.product_id,datas.keyword_id,id],(err, res) => {
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
"DELETE FROM rule_based_keyword  WHERE id = ?",id, (err, res) => {
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
sql.query("DELETE FROM rule_based_keyword", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;