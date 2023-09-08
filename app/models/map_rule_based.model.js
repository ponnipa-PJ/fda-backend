const sql = require("./db");

const Data = function (datas) {
    this.status=datas.status;
this.rule_based_id=datas.rule_based_id;this.dict_id=datas.dict_id;};
Data.create = (newData, result) => {
    // console.log(newData.dict_id);
    var data = {
        status:newData.status,
        rule_based_id:newData.rule_based_id,
        dict_id:JSON.stringify(newData.dict_id),
    }
    // console.log(data);
sql.query("INSERT INTO map_rule_based SET ?", data, (err, res) => {
    console.log(err);
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.getAll = (name, result) => {
    var list= []
    var dict_name =[]
// let query = "SELECT m.*,r.answer FROM map_rule_based m join rule_based r on m.rule_based_id = r.id WHERE m.status = 1";
let query = "SELECT a.*,r.answer FROM advertise a left join map_rule_based m on m.dict_id = a.dict_id left JOIN rule_based r on r.id = m.rule_based_id order BY a.product_id,a.id;"
if (name) {
query += ` WHERE name LIKE '%${name}%'`;
}
sql.query(query, async (err, res) => {
    for (let r = 0; r < res.length; r++) {
        
    //     var dict = JSON.parse(res[r].dict_id);
    //     res[r].no = dict.length
            res[r].sen = JSON.parse(res[r].sen);
            res[r].dict_id = JSON.parse(res[r].dict_id);
        
    //      for (let d = 0; d < dict.length; d++) {
    //         // console.log(d+1);
    //         // console.log(dict.length);
    //         var dic = `SELECT * FROM dicts where id = ${dict[d]} LIMIT 1`
    //         dd = dict.length
    //         sql.query(dic, (err, di) => {
    //              dict_name.push(di[0].name)
    //             //  if (d + 1 == dict.length) {
                     
    //                  // console.log(res);
    //             //  }
    //             // console.log('d',d+1);
    //             // console.log(res[r].no);
    //             if (d+1 == res[r].no) {
    //                 res[r].data = dict_name;
    //                 dict_name = []
    //             }
    //          });
    //     }
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
Data.findById = (id, result) => {
sql.query(`SELECT * FROM map_rule_based WHERE id = ${id}`, (err, res) => {
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
"UPDATE map_rule_based SET rule_based_id = ?,dict_id = ? WHERE id = ?",
[datas.rule_based_id,datas.dict_id,id],(err, res) => {
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
Data.remove = (id, datas, result) => {
    console.log(datas);
    sql.query(
    "UPDATE map_rule_based SET status = ? WHERE id = ?",
    [datas.status,id],(err, res) => {
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

Data.removeAll = result => {
sql.query("DELETE FROM map_rule_based", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;