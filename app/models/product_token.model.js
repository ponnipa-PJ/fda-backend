const sql = require("./db");

const Data = function (datas) {
this.url=datas.url;this.sentence=datas.sentence;this.sentence_keyword=datas.sentence_keyword;this.status=datas.status;};
Data.create = (newData, result) => {
sql.query("INSERT INTO product_token SET ?", newData, (err, res) => {
if (err) {
result(err, null);
return;
}
result(null, { id: res.insertId, ...newData });
});
}
const merge = (first, second) => {
    for(let i=0; i<second.length; i++) {
      first.push(second[i]);
    }
    return first;
  }

  Data.getmapproduct = (newData, result) => {
    // console.log(newData.url);
    var list = []
    mapid = JSON.parse(newData.url)
    // console.log(mapid);
    var sqlquery = `map_rule_based_id = `
        for (let did = 0; did < mapid.length; did++) {
                if (did == 0) {
                    sqlquery += ` ${mapid[did]}`
                    
                }
                // if (did+1 != keyword_id.length) {
                    sqlquery += ` or map_rule_based_id = ${mapid[did]}`
                // }
                if (did+1 == mapid.length) {
                    
                
                let besttoken = `SELECT dict_id FROM rule_based where `;
                besttoken += sqlquery
                    // console.log(besttoken);
                 sql.query(besttoken, async (err, besttokens) => {
for (let b = 0; b < besttokens.length; b++) {
    list.push(besttokens[b].dict_id)
    
}
   
                                    
                  
if (err) {
    result(err, null);
    return;
    }
    setTimeout(async () => {
        
        result(null, list);
    }, 2000);  
});
}  
        
}
    
    }

Data.getproduct = (newData, result) => {
    // console.log(newData);
    sql.query(`SELECT * FROM product_token WHERE url = "${newData.url}"`, (err, res) => {
        if (res.length != 0) {
            let query = `SELECT a.* FROM advertise a where a.product_token_id = ${res[0].id}`;
console.log(query);
sql.query(query, async (err, des) => {
    res[0].keyword = des
    var arrrule = []
    for (let d = 0; d < res[0].keyword.length; d++) {

        var keyword_id = JSON.parse(res[0].keyword[d].keyword_dict_id)
        var sqlquery = `r.dict_id = `
        for (let did = 0; did < keyword_id.length; did++) {
            // console.log(keyword_id[did]);
                var arrrule = []
                var arrrulename=[]
                if (did == 0) {
                    sqlquery += ` ${keyword_id[did]}`
                    
                }
                // if (did+1 != keyword_id.length) {
                    sqlquery += ` or r.dict_id = ${keyword_id[did]}`
                // }
                if (did+1 == keyword_id.length) {
                    let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where `;
            besttoken += sqlquery
                
// // console.log(keyword_id[did]);
// console.log(besttoken);
// let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where r.dict_id = ${keyword_id[did]}`;
            await sql.query(besttoken, async (err, besttokens) => {
                
                var arrrule = []
                for (let b = 0; b < besttokens.length; b++) {
                    arrrule.push(besttokens[b].map_rule_based_id)
                    if (b+1 == besttokens.length) {
                        res[0].keyword[d].map = arrrule
                    }
                    
                }
//                 for (let b = 0; b < besttokens.length; b++) {
//                                         // console.log(did+1);
//                                         // console.log(besttokens[b].map_rule_based_id);
//                                         let maprulebase = `SELECT * FROM rule_based where map_rule_based_id = ${besttokens[b].map_rule_based_id} order by no;`;
//                                     //    console.log(maprulebase);
//                                        await sql.query(maprulebase, (err, maprulebases) => {
// // console.log(did+1,keyword_id.length);
// for (let m = 0; m < maprulebases.length; m++) {
//                                 // console.log(m+1,maprulebases.length);
//                                 // arrrulename.push(maprulebases[m].dict_name)
//                                 arrrule.push(maprulebases[m].dict_id)
//                                 // console.log(b+1 ,besttokens.length);
//                                 if (m+1,maprulebases.length && b+1 ,besttokens.length) {
//                                     console.log((JSON.parse(res[0].keyword[d].keyword_dict_id)).length);
//                                     res[0].keyword[d].rulebased = arrrule
//                                     arrrule = []
//                                 }
//                             }
//                 })
//             }
            });
                }
                // console.log(did+1 ,keyword_id.length);
                // console.log(arrrule);
                // res[0].keyword[d].rule = arrrule
            }
// // console.log(keyword_id[did]);
// // let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where r.dict_id = ${keyword_id[did]}`;
//             await sql.query(besttoken, async (err, besttokens) => {
// //                 res[0].keyword[d].rulebased = besttokens
//                 console.log(besttoken);
//                 for (let b = 0; b < besttokens.length; b++) {
//                     // console.log(did+1);
//                     // console.log(besttokens[b].map_rule_based_id);
//                     let maprulebase = `SELECT * FROM rule_based where map_rule_based_id = ${besttokens[b].map_rule_based_id} order by no;`;
//                 //    console.log(maprulebase);
//                    await sql.query(maprulebase, (err, maprulebases) => {

//                     // console.log(arrrule);
//                     // res[0].keyword[d].rulebased = maprulebases
//                     // res[0].keyword[d].rulebasedname = arrrulename
//                         // for (let m = 0; m < maprulebases.length; m++) {
//                         //     // console.log(maprulebases[m].map_rule_based_id);
//                         //     arrrulename.push(maprulebases[m].dict_name)
//                         //     arrrule.push(maprulebases[m].dict_id)
//                         // }
//                 //  console.log(m+1 , maprulebases.length, b+1 , besttokens.length);
//                 //  console.log((JSON.parse(des[d].dict_id)).length);
//                 //  console.log(d+1);
//                 //  console.log(des.length);
// // console.log(no[d-1]);
//                 // if (d+1 == des.length && b+1 == besttokens.length && m+1 == maprulebases.length) {
//                     // console.log(arrrulename);
//                     // console.log(arrrule);
//                     // console.log(res[0].keyword[d].dict_id);
//                     // console.log(d+1);
//                     // res[0].keyword[d].rulebased = arrrule
//                     // res[0].keyword[d].rulebasedname = arrrulename
//                     // arrrule = []
//                     // arrrulename=[]
//                         // }
                          
//                         // }
                        
//                     })
                  
//                 }
            // });
        
        // console.log(sql);
        // console.log(d+1,res[0].keyword.length);
    }               
    
});
        }
        
    if (err) {
    result(err, null);
    return;
    }
    setTimeout(async () => {
        // for (let b = 0; b < res[0].keyword.length; b++) {
        //     var arrrule= []
        //     for (let m = 0; m < res[0].keyword[b].map.length; m++) {
        //                                             // console.log(did+1);
        //                                             // console.log(besttokens[b].map_rule_based_id);
        //                                             let maprulebase = `SELECT * FROM rule_based where map_rule_based_id = ${res[0].keyword[b].map[m].map_rule_based_id} order by no;`;
        //                                         //    console.log(maprulebase);
        //                                            await sql.query(maprulebase, (err, maprulebases) => {
        //     // console.log(did+1,keyword_id.length);
        //     for (let mm = 0; mm < maprulebases.length; mm++) {
        //                                     // console.log(m+1,maprulebases.length);
        //                                     // arrrulename.push(maprulebases[m].dict_name)
        //                                     arrrule.push(maprulebases[mm].dict_id)
        //                                     // console.log(m+1,res[0].keyword[b].map.length);
        //                                     // console.log(b+1 ,besttokens.length);
        //                                     if (m+1 == res[0].keyword[b].map.length) {
        //                                     //     console.log((JSON.parse(res[0].keyword[d].keyword_dict_id)).length);
        //                                     res[0].keyword[b].rulebased = arrrule
        //                                     // console.log(res[0].keyword[b].rulebased);
        //                                         arrrule = []
        //                                     }
        //                                 }
        //                     })
        //                 }
        //                 }
// for (let k = 0; k < res[0].keyword.length; k++) {
    
//     var dict_id = JSON.parse(res[0].keyword[k].dict_id)
//     // console.log(res[0].keyword[k].rulebased);
//             var arrall =  merge(res[0].rulebased, dict_id);
//             // console.log('arrrule',arrall);
//             // console.log('dict_id',dict_id);
//                         let uniqueChars = arrall.filter((c, index) => {
//                             return arrall.indexOf(c) === index;
//                         });
//                         var sumdictId = uniqueChars
//                         // console.log('sumdictId',sumdictId);
//                         // console.log('dict_id',dict_id.length);
//                         // console.log(sumdictId.length);
//                         var percentage = (100 * parseInt(sumdictId.length)/parseInt(dict_id.length))
//                         // console.log(percentage);
//                         res[0].keyword[k].percentage = percentage
// }
        result(null, res[0]);
    }, 2000);
    });
    }

Data.getAll = (name, result) => {
    console.log(name);
let query = "SELECT * FROM product_token";
if (name) {
query += ` WHERE url = '${name}'`;
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
sql.query(`SELECT * FROM product_token WHERE id = ${id}`, (err, res) => {
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
"UPDATE product_token SET url = ?,sentence = ?,sentence_keyword = ?,status = ? WHERE id = ?",
[datas.url,datas.sentence,datas.sentence_keyword,datas.status,id],(err, res) => {
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
"DELETE FROM product_token  WHERE id = ?",id, (err, res) => {
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
sql.query("DELETE FROM product_token", (err, res) => {
if (err) {
result(null, err);
return;
}
result(null, res);
});
};

module.exports = Data;