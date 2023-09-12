const sql = require("./db");

const Data = function (datas) {
this.product_id=datas.product_id;this.dict_id=datas.dict_id;this.sen=datas.sen;this.sentent=datas.sentent;};
Data.create = (newData, result) => {
sql.query("INSERT INTO advertise SET ?", newData, (err, res) => {
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.getkeyword = (name, result) => { 
    list = []
    let query = "SELECT * FROM advertise";
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
                // console.log(getkeyword);
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
    }, 1000);
    });
    };

Data.getAll = (name, result) => {
let query = "SELECT * FROM advertise";
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
sql.query(`SELECT * FROM advertise WHERE id = ${id}`, (err, res) => {
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
    //console.log(datas);
    dict_id = JSON.stringify(datas.dict_id)
sql.query(
"UPDATE advertise SET dict_id = ? WHERE id = ?",
[dict_id,id],(err, res) => {
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
"DELETE FROM advertise  WHERE id = ?",id, (err, res) => {
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
sql.query("DELETE FROM advertise", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;