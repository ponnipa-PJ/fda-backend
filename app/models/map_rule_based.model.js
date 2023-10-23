const sql = require("./db");

const Data = function (datas) {
    this.status=datas.status;this.answer=datas.answer;
this.advertise_id=datas.advertise_id;this.user=datas.user;this.keyword_id=datas.keyword_id};
Data.create = (newData, result) => {
    // console.log(newData.dict_id);
    var data = {
        status:newData.status,
        advertise_id:newData.advertise_id,
        user:newData.user,
        answer:newData.answer,
        keyword_id:newData.keyword_id,
    }
    // console.log(data);
sql.query("INSERT INTO map_rule_based SET ?", data, (err, res) => {
    //console.log(err);
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}

Data.getallrulebased = (ad_id,user, result) => {
    var list= []
    var dict_id =[]
// let query = "SELECT m.*,r.answer FROM map_rule_based m join rule_based r on m.rule_based_id = r.id WHERE m.status = 1";
let query = `SELECT * FROM rule_based group by map_rule_based_id`

// console.log(query);
sql.query(query, async (err, res) => {
    for (let r = 0; r < res.length; r++) {
            var dic = `SELECT * FROM rule_based where map_rule_based_id = '${res[r].map_rule_based_id}' order by no asc`
            // console.log(dic);
            sql.query(dic, (err, di) => {
                res[r].dict = di
             });
        }
if (err) {
result(null, err);
return;
}
setTimeout(() => {

    result(null, res);
}, 1000);
});
};

Data.findadanduser = (ad_id,user, result) => {
    var list= []
    var dict_id =[]
// let query = "SELECT m.*,r.answer FROM map_rule_based m join rule_based r on m.rule_based_id = r.id WHERE m.status = 1";
let query = `SELECT * FROM map_rule_based WHERE advertise_id = ${ad_id}`
if (user) {
    query += ` and user = ${user}`
}

// console.log(query);
sql.query(query, async (err, res) => {
    // for (let r = 0; r < res.length; r++) {
        
    // //     var dict = JSON.parse(res[r].dict_id);
    //         res[r].sen = JSON.parse(res[r].sen);
    //         res[r].dict_id = JSON.parse(res[r].dict_id);
    //         res[r].dict_name = JSON.parse(res[r].dict_name);
    //         res[r].no = res[r].sen.length
    //     // console.log(res[r].sen);
    //     //  for (let d = 0; d < res[r].sen.length; d++) {
    //     //     // console.log(d+1);
    //     //     // console.log(dict.length);
    //     //     var dic = `SELECT * FROM dicts where name = '${res[r].sen[d].name}' LIMIT 1`
    //     //     // console.log(dic);
    //     //     sql.query(dic, (err, di) => {
    //     //         dictid = 0
    //     //         dictname=res[r].sen[d].name
    //     //         // console.log(di);
    //     //         if (di.length) {
    //     //             dictid = di[0].id
    //     //         }
    //     //         dict_id.push({id:dictid,
    //     //             name:dictname})
    //     //         //  if (d + 1 == dict.length) {
                     
    //     //              // console.log(res);
    //     //         //  }
    //     //         // console.log('d',d+1);
    //     //         // console.log(res[r].no);
    //     //         if (d+1 == res[r].no) {
    //     //             res[r].dict_id_new = dict_id;
    //     //             dict_id = []
    //     //         }
    //     //      });
    //     // }
    //     // if (r+1 == res.length) {
    //     //     list = res
    //     // }
    // }
if (err) {
result(null, err);
return;
}
setTimeout(() => {

    result(null, res);
}, 1000);
});
};

Data.checkintb = (name, result) => {
    var list= {}
    var dict_id =[]
    console.log(name);
    var namefull = JSON.parse(name)
    var dict_namesql = ''
    for (let n = 0; n < namefull.length; n++) {
        if (n == 0) {
            dict_namesql += ` ${namefull[n]}`
        }else{
            dict_namesql += ` or dict_id = ${namefull[n]}`
        }
        
    }
// let query = "SELECT m.*,r.answer FROM map_rule_based m join rule_based r on m.rule_based_id = r.id WHERE m.status = 1";
let query = "SELECT * FROM rule_based"
// let query = "SELECT a.*,m.answer FROM advertise a left join map_rule_based m on m.advertise_id = a.id order BY a.id desc"

if (name) {
query += ` WHERE dict_id = ${dict_namesql}`;
}
query += ' group by map_rule_based_id'
console.log(query);
sql.query(query, async (err, res) => {
    for (let r = 0; r < res.length; r++) {
        
    // //     var dict = JSON.parse(res[r].dict_id);
    //         res[r].sen = JSON.parse(res[r].sen);
    //         res[r].dict_id = JSON.parse(res[r].dict_id);
    //         res[r].dict_name = JSON.parse(res[r].dict_name);
    //         res[r].no = res[r].sen.length
    //     // console.log(res[r].sen);
    //     //  for (let d = 0; d < res[r].sen.length; d++) {
    //     //     // console.log(d+1);
    //     //     // console.log(dict.length);
            var dic = `SELECT * FROM rule_based where map_rule_based_id = ${res[r].map_rule_based_id}`
    //     //     // console.log(dic);
            sql.query(dic, (err, di) => {
                // console.log(di.length);
                // console.log(namefull.length);
                if (di.length == namefull.length) {
                    console.log(res[r].map_rule_based_id);
                    var arr = []
                    for (let m = 0; m < di.length; m++) {
                        arr.push(di[m].dict_id)
                        if (m+1 == di.length) {
                            
                    const uniquekeyword = arr.filter(element => namefull.includes(element));
                    console.log(uniquekeyword);
                    if (uniquekeyword.length == namefull.length) {
                        list = {count:1}
                    }
                        }
                    }
if (r+1 == res.length && list == {}) {
    list = {count:0}
}
                }
             });
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
    var list= []
    var dict_id =[]
// let query = "SELECT m.*,r.answer FROM map_rule_based m join rule_based r on m.rule_based_id = r.id WHERE m.status = 1";
let query = "SELECT a.*,p.cat_fda,c.name as category FROM advertise a left join products p on p.id = a.product_id left join category c on c.id = p.cat_id order BY a.product_id,a.id"
// let query = "SELECT a.*,m.answer FROM advertise a left join map_rule_based m on m.advertise_id = a.id order BY a.id desc"

if (name) {
query += ` WHERE name LIKE '%${name}%'`;
}
sql.query(query, async (err, res) => {
    for (let r = 0; r < res.length; r++) {
        
    //     var dict = JSON.parse(res[r].dict_id);
            res[r].sen = JSON.parse(res[r].sen);
            res[r].dict_id = JSON.parse(res[r].dict_id);
            res[r].dict_name = JSON.parse(res[r].dict_name);
            res[r].no = res[r].sen.length
        // console.log(res[r].sen);
        //  for (let d = 0; d < res[r].sen.length; d++) {
        //     // console.log(d+1);
        //     // console.log(dict.length);
        //     var dic = `SELECT * FROM dicts where name = '${res[r].sen[d].name}' LIMIT 1`
        //     // console.log(dic);
        //     sql.query(dic, (err, di) => {
        //         dictid = 0
        //         dictname=res[r].sen[d].name
        //         // console.log(di);
        //         if (di.length) {
        //             dictid = di[0].id
        //         }
        //         dict_id.push({id:dictid,
        //             name:dictname})
        //         //  if (d + 1 == dict.length) {
                     
        //              // console.log(res);
        //         //  }
        //         // console.log('d',d+1);
        //         // console.log(res[r].no);
        //         if (d+1 == res[r].no) {
        //             res[r].dict_id_new = dict_id;
        //             dict_id = []
        //         }
        //      });
        // }
        // if (r+1 == res.length) {
        //     list = res
        // }
    }
if (err) {
result(null, err);
return;
}
setTimeout(() => {

    result(null, res);
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

Data.updateanswer = (id, datas, result) => {
    sql.query(
    "UPDATE map_rule_based SET answer = ? WHERE id = ?",
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
    //console.log(datas);
    sql.query(
    "UPDATE map_rule_based SET answer = ? WHERE id = ?",
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