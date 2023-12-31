const sql = require("./db");

const Data = function (datas) {
    this.map_rule_based_id=datas.map_rule_based_id;this.rule_based_name=datas.rule_based_name;this.rule_based_id=datas.rule_based_id;this.sentence_rulebase=datas.sentence_rulebase;this.count_rulebased=datas.count_rulebased;this.dict_name=datas.dict_name;this.keyword_dict_id=datas.keyword_dict_id;this.product_id=datas.product_id;this.dict_id=datas.dict_id;this.sen=datas.sen;this.sentent=datas.sentent;this.product_token_id=datas.product_token_id;};
Data.create = (newData, result) => {
    var data = {
        product_token_id:newData.product_token_id,
        keyword_dict_id:JSON.stringify(newData.keyword_dict_id),
        dict_id:JSON.stringify(newData.dict_id),
        dict_name:JSON.stringify(newData.dict_name),
        sen:newData.sen,
        sentent:newData.sentent,
        sentence_rulebase:newData.sentence_rulebase
    }
    // console.log(data);
sql.query("INSERT INTO advertise SET ?", data, (err, res) => {
    // console.log(err);
    // console.log(res.insertId);
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId });
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

Data.updaterulebased = (id, datas, result) => {
    // console.log(datas);
    var sentence_rulebase = JSON.stringify(datas.sentence_rulebase)
    var rule_based_id = JSON.stringify(datas.rule_based_id)
    var rule_based_name = JSON.stringify(datas.rule_based_name)
    var count_rulebased = datas.count_rulebased.toFixed(2)
    // console.log(`UPDATE advertise SET map_rule_based_id= ${datas.map_rule_based_id} ,count_rulebased = ${datas.count_rulebased} , rule_based_id = '${rule_based_id}', rule_based_name = '${rule_based_name}', sentence_rulebase = ${sentence_rulebase} WHERE id = ${id}`);
    sql.query(`UPDATE advertise SET map_rule_based_id= ${datas.map_rule_based_id} ,count_rulebased = ${count_rulebased} , rule_based_id = '${rule_based_id}', rule_based_name = '${rule_based_name}', sentence_rulebase = ${sentence_rulebase} WHERE id = ${id}`, (err, res) => {
    console.log(err);
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
    // console.log(`DELETE FROM advertise product_token_id = ${id}`);
sql.query(
`DELETE FROM advertise WHERE product_token_id = ${id}`,(err, res) => {
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