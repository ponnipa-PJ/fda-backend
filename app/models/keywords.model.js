const sql = require("./db");

const Data = function (datas) {
    this.weight=datas.weight;this.name=datas.name;this.token=datas.token;this.status=datas.status;this.dict_id=datas.dict_id;this.dict_name=datas.dict_name;};
Data.create = (newData, result) => {
sql.query("INSERT INTO keywords SET ?", newData, (err, res) => {
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.getAll = (name, result) => {
let query = "SELECT * FROM keywords";
if (name) {
query += ` WHERE status = ${name}`;
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
sql.query(`SELECT * FROM keywords WHERE id = ${id}`, (err, res) => {
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

Data.updateweight = (id, datas, result) => {
    // console.log(datas.name);
    var name = datas.name.replaceAll('[','(')
    name = name.replaceAll(']',')')
    // console.log(name);
    // console.log(`select k.* from dicts d join keyword_dicts k on k.name = d.name where d.id IN ${name} `);
    sql.query(
        `select k.* from dicts d join keyword_dicts k on k.name = d.name where d.id IN ${name} `,(err, res) => {
            // console.log(res);
            
            if (res.length >0 ) {
                for (let k = 0; k < res.length; k++) {
            weight = res[k].weight +1
            sql.query(
                `UPDATE keyword_dicts SET weight = ${weight} WHERE id = ${res[k].id} `,(err, res) => {
                });
                }
                
            }
            // console.log(weight);
  
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

Data.updatedictid = (id, datas, result) => {
    //console.log(datas.dict_id);
    datas.dict_id = JSON.stringify(datas.dict_id)
    datas.dict_name = JSON.stringify(datas.dict_name)
    sql.query(
    "UPDATE keywords SET dict_id = ?,dict_name=? WHERE id = ?",
    [datas.dict_id,datas.dict_name,id],(err, res) => {
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

Data.updateById = (id, datas, result) => {
    var token = JSON.stringify(datas.token)
sql.query(
"UPDATE keywords SET name = ?, token = ? WHERE id = ?",
[datas.name,token,id],(err, res) => {
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
"UPDATE keywords SET status = 0 WHERE id = ?",id, (err, res) => {
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
sql.query("DELETE FROM keywords", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;