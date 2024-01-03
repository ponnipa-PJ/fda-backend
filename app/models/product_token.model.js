const sql = require("./db");
const axios = require('axios');

const url = 'http://localhost:8081'

// const url = 'https://api-fda.ponnipa.in.th'
// const url = 'https://api-fda.ci2ict.com'

const Data = function (datas) {
    this.advertise_id = datas.advertise_id;this.img_path = datas.img_path;this.type_productId = datas.type_productId;this.type_rulebasedId = datas.type_rulebasedId;this.sentencefull = datas.sentencefull;this.name = datas.name; this.fda = datas.fda; this.product_status = datas.product_status; this.cat_status = datas.cat_status; this.fda_status = datas.fda_status; this.name_status = datas.name_status; this.id = datas.id; this.keyword_id = datas.keyword_id; this.url = datas.url; this.sentence = datas.sentence; this.sentence_keyword = datas.sentence_keyword; this.status = datas.status;
};
Data.create = (newData, result) => {
    var data = {
        url: newData.url,
        sentence: newData.sentence,
        sentence_keyword: newData.sentence_keyword,
        keyword_id: JSON.stringify(newData.keyword_id),
        status: newData.status,
        sentencefull:newData.sentencefull,
        type_rulebasedId:newData.type_rulebasedId,
        type_productId:newData.type_productId,
        img_path:newData.img_path
    }
    sql.query("INSERT INTO product_token SET ?", data, (err, res) => {
        console.log(err);
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId });
    });
}
const merge = (first, second) => {
    for (let i = 0; i < second.length; i++) {
        first.push(second[i]);
    }
    return first;
}
function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}
Data.getmapproduct = (newData, result) => {
    let pro = `SELECT * FROM advertise where id = ${newData.id}`;
    // let besttoken = `SELECT dict_id FROM rule_based where map_rule_based_id = ${mapid[did].map_rule_based_id} order by no`;
    // console.log(pro);
    sql.query(pro, (err, pros) => {

        // console.log(newData);
        var list = []
        var mapid = JSON.parse(newData.url)
        var dict_id = JSON.parse(newData.keyword_id)

        //   console.log(mapid);
        for (let did = 0; did < mapid.length; did++) {
            var arrbest = []
            var arrbestname = []
            var allcount = 0
            var countzero = 1
            let besttoken = `SELECT map_rule_based_id FROM rule_based r LEFT JOIN map_rule_based m on r.map_rule_based_id = m.id where r.dict_id = ${mapid[did]}`;
            // let besttoken = `SELECT dict_id FROM rule_based where map_rule_based_id = ${mapid[did].map_rule_based_id} order by no`;
            // console.log(besttoken);
            sql.query(besttoken, async (err, besttokens) => {
                // console.log(besttokens);
                for (let m = 0; m < besttokens.length; m++) {
                    let findmap = `SELECT dict_id,dict_name FROM rule_based where map_rule_based_id = ${besttokens[m].map_rule_based_id} order by no`;
                    sql.query(findmap, async (err, findmaps) => {
                        mapdict = []
                        mapdictname = []
                        for (let b = 0; b < findmaps.length; b++) {
                            mapdict.push(findmaps[b].dict_id)
                            mapdictname.push(findmaps[b].dict_name)
                            // list.push(besttokens[b].dict_id)
                            if (b + 1 == findmaps.length) {
                                // console.log(mapid[did]);
                                // console.log(dict_id);
                                dict_id.indexOf(mapid[did])
                                var indexesall = getAllIndexes(dict_id, mapid[did]);
                                // console.log(indexesall);
                                for (let idx = 0; idx < indexesall.length; idx++) {
                                    indexmapdict = mapdict.indexOf(mapid[did])
                                    indexdictid = indexesall[idx]
                                    realrule = []
                                    mapdict.map((myArr, index) => {
                                        realrule.push(0)
                                    })
                                    newmaparr = []
                                    dict_id.map((myArr, index) => {
                                        newmaparr.push('x')
                                    })
                                    var no = indexdictid - indexmapdict
                                    // console.log('---------------');
                                    // console.log(besttokens[m].map_rule_based_id);
                                    // console.log(indexmapdict, indexdictid);
                                    // console.log(realrule);
                                    // console.log(mapdict);
                                    //     console.log(dict_id);
                                    if (indexmapdict <= indexdictid) {

                                        for (let r = 0; r < realrule.length; r++) {
                                            realrule[r] = no + r
                                        }
                                        // console.log('newmaparr',newmaparr);

                                        for (let r = 0; r < realrule.length; r++) {
                                            //    console.log(realrule[r]);
                                            //    console.log(mapdict[r]);
                                            var index = realrule[r];
                                            var value = mapdict[r];
                                            newmaparr.splice(index, 1, value);
                                        }
                                        // console.log(realrule);
                                        // console.log(mapdict);
                                        // console.log(mapdictname);
                                        // console.log(dict_id);
                                        // console.log(newmaparr);
                                        var sum = dict_id.map(function (num, idx) {
                                            return num - newmaparr[idx];
                                        });
                                        //   console.log(sum);

                                        allcount = 0
                                        var sumone = getAllIndexes(sum, 0);
                                        // console.log(sumone);
                                        var percent = (100 * sumone.length) / (mapdict.length).toFixed(2)
                                        // console.log(percent);
                                        list.push({ 'length': mapdict.length, 'allcount': percent, 'rule': mapdict, 'name': mapdictname, 'map_id': besttokens[m].map_rule_based_id })
                                        // for (let s = 0; s < sum.length; s++) {
                                        //     if (sum[s] == 0) {
                                        //         allcount = allcount + 1
                                        //     }
                                        //     arrbest = mapdict
                                        //     arrbestname = mapdictname
                                        //     if (s + 1 == sum.length) {

                                        //         console.log('allcount', allcount);
                                        //         console.log(countzero);
                                        //         if (allcount > countzero) {
                                        //             if (mapdict.length == countzero) {
                                        //                 countzero = allcount
                                        //                 arrbest = mapdict
                                        //                 arrbestname = mapdictname
                                        //             } else {
                                        //                 countzero = allcount
                                        //                 arrbest = mapdict
                                        //                 arrbestname = mapdictname
                                        //             }
                                        //         }
                                        //     }

                                        // }
                                    }
                                }
                                // console.log(mapdict);
                                // console.log(mapdictname);
                                //   [ 45, 116, 58 ]
                                // if (did + 1 == mapid.length) {
                                //     // console.log(countzero);
                                //     // console.log(mapid[did]);
                                //     // console.log(arrbest);
                                //     list.push({ 'allcount': allcount, 'rule': arrbest, 'name': arrbestname })
                                //     // console.log(getMax(list,'allcount'))
                                // }
                                //   realrule.map((myArr, index) => {
                                //     if (myArr == indexdictid) {
                                //         realrule[index] = indexdictid
                                //     }
                                //     else if ((indexmapdict+1) == indexdictid) {
                                //     if (index < indexmapdict) {
                                //         realrule[index] =indexdictid-(index+1)
                                //     }else if (index > indexmapdict) {
                                //         realrule[index] =indexdictid+(index)
                                //     }
                                //     }
                                //     else if (indexmapdict == indexdictid || indexmapdict == 0) {
                                //         realrule[index] = index
                                //         }else if (indexmapdict < indexdictid) {
                                //             if (index < indexmapdict) {
                                //                 realrule[index] =(indexdictid-(realrule.length))+(index+2)
                                //             }else if (index > indexmapdict) {
                                //                 realrule[index] =(indexdictid-(realrule.length))-(index+2)
                                //             }
                                //             }
                                //   });
                                //                                       realrule.map((myArr, index) => {
                                //                                         if (myArr == indexdictid) {
                                //                                             realrule[index] = indexdictid
                                //                                         } else if (index < indexdictid) {
                                //     realrule[index] = (indexdictid - realrule.length) +(index+1)
                                // }else if (index >= indexdictid) {
                                //     realrule[index] = (index+1 + realrule.length) -(realrule.length)
                                // }else if(realrule[index] != indexdictid){

                                // }
                                //                                       })
                                //   console.log(realrule);
                                // mapdict.map((myArr, index) => {
                                //     if (index < indexdictid) {
                                //         realrule.push(0)
                                //     }
                                //     // console.log(`your index is -> ${index} AND value is ${myArr}`);
                                //   })
                                //   var sumarr = realrule.concat(mapdict);
                                //   console.log(sumarr);
                                //   var sum = dict_id.map(function (num, idx) {
                                //     return num - sumarr[idx];
                                //   });
                                //   console.log(sum);
                            }
                        }
                    })
                }

            });
        }
        if (err) {
            result(err, null);
            return;
        }
        setTimeout(() => {

            result(null, list);
        }, 2000);

    });
}
function getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function array_move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing purposes
};

Data.getbestrulebased = (newData, result) => {
    var list = []
    // console.log(newData);
    var arrrule = newData.sentence.name
    // console.log(newData.sentence);
    var rule_based_name = arrrule.toString()
    rule_based_name = rule_based_name.replaceAll(',', '')

    sql.query(`SELECT * FROM advertise WHERE id = ${newData.id}`, async (err, res) => {
        if (res.length != 0) {
            var dict_id = JSON.parse(res[0].keyword_dict_id)
            var dict_idsentence = JSON.parse(res[0].dict_id)
            var sen = res[0].sen
            var sen_result = ''
            // console.log(sen);
            // console.log(rule_based_name);
            // await axios.get(url + '/loaddict?word='+rule_based_name).then(async () => {
            //   });
            var sqlquery = 'id = '
            for (let d = 0; d < dict_id.length; d++) {
                if (d == 0) {
                    sqlquery += dict_id[d]
                } else {
                    sqlquery += ' or id = ' + dict_id[d]
                }

            }
            // console.log(rule_based_name);
            await axios.get(url + '/token?text=' + sen).then((data) => {
                // console.log(data);
                sen_result = data.data
            });
            //   console.log(sen_result);

            // console.log(`SELECT * FROM dicts WHERE ${sqlquery}`);
            sql.query(`SELECT * FROM dicts WHERE ${sqlquery}`, (err, dict) => {
                var dictname = [];
                dict.map(function (num, idx) {
                    // console.log(num.name);
                    dictname.push(num.name);
                });
                // console.log(dictname);
                var sentent = JSON.parse(res[0].dict_name);
                var sumtext = sentent.toString();
                // console.log(sumtext);
                sumtext = sumtext.replaceAll(',', '');
                // var arrrule = newData.sentence.name
                // console.log(newData.sentence);
                // var rule_based_name =arrrule.toString()
                // rule_based_name = rule_based_name.replaceAll(',', '')
                //                 console.log(rule_based_name);
                // console.log(sen_result);
                // console.log();
                // console.log(arrrule.length,dict_idsentence.length);
                // console.log(sen_result.length);
                if (arrrule.length == dict_idsentence.length) {
                    sen_result.map(function (sen, i) {
                        if (i == 0) {

                            sen_result[i] = '<span style=color:yellow>' + sen;
                        }
                        console.log(i + 1, sen_result.length);
                        if (i + 1 == sen_result.length) {
                            // console.log(sen_result[i]);
                            sen_result[i] = sen + '</span>';
                        }
                    });

                } else {
                    // arrrule.map(function (num, idx) {
                    sen_result.map(function (sen, i) {
                        if (rule_based_name == sen) {
                            sen_result[i] = sen.replaceAll(sen, '<span style=color:yellow>' + sen + '</span>');
                        }
                    });
                    // })
                    dictname.map(function (num, idx) {
                        sen_result.map(function (sen, i) {
                            if (num == sen) {
                                sen_result[i] = num.replaceAll(sen, '<span style=color:red>' + sen + '</span>');
                            }
                        });
                    });
                }




                var sumtext = sen_result.toString();
                // console.log(sumtext);
                sumtext = sumtext.replaceAll(',', '');
                list = { 'sentence': sumtext, 'count': newData.sentence.allcount, 'rule_based_id': newData.sentence.rule, 'rule_based_name': newData.sentence.name, 'map_id': newData.sentence.map_id };

                //     sentent.map(function (num, idx) {
                //     for (let n = 0; n < arrrule.length; n++) {
                //         if (num == arrrule[n]) {
                //             sentent[idx] = num.replaceAll(arrrule[n], '<span style=color:yellow>' + arrrule[n] + '</span>')
                //         }
                //         if (n+1 == arrrule.length) {
                //             var sumtext = sentent.toString()
                //     console.log(sumtext);
                //     sumtext = sumtext.replaceAll(',', '')
                //             list = {'sentence':sumtext,'count':newData.sentence.allcount,'rule_based_id':newData.sentence.rule
                //             }
                //         }
                //     }
                // });
            });
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

// Data.getbestrulebased = (newData, result) => {
//     var list = []
//     // console.log(newData);
//     sql.query(`SELECT * FROM advertise WHERE id = ${newData.id}`, (err, res) => {
//         if (res.length != 0) {
//             var dict_id = JSON.parse(res[0].keyword_dict_id)
//             var sen = res[0].sen
//             var sqlquery = 'id = '
//             for (let d = 0; d < dict_id.length; d++) {
//                 if (d == 0) {
//                     sqlquery += dict_id[d]
//                 } else {
//                     sqlquery += ' or id = ' + dict_id[d]
//                 }

//             }
//             // console.log(`SELECT * FROM dicts WHERE ${sqlquery}`);
//             sql.query(`SELECT * FROM dicts WHERE ${sqlquery}`, (err, dict) => {
//                 var dictname = []
//                 dict.map(function (num, idx) {
//                     // console.log(num.name);
//                     dictname.push(num.name)
//                 })
//                 // console.log(dictname);

//                 var sentent = JSON.parse(res[0].dict_name)
//                 var sumtext = sentent.toString()
//                 // console.log(sumtext);
//                 sumtext = sumtext.replaceAll(',', '')
//                 var arrrule = newData.sentence.name
//                 // console.log(arrrule);

//                 arrrule.map(function (num, idx) {
//                     sentent.map(function (sen, i) {
//                         if (num == sen) {
//                             sentent[i] = num.replaceAll(sen, '<span style=color:yellow>' + sen + '</span>')
//                         }
//                     })
//                 }) 
//                 dictname.map(function (num, idx) {
//                     sentent.map(function (sen, i) {
//                         if (num == sen) {
//                             sentent[i] = num.replaceAll(sen, '<span style=color:red>' + sen + '</span>')
//                         }
//                     })
//                 })
//                 var sumtext = sentent.toString()
//                 // console.log(sumtext);
//                 sumtext = sumtext.replaceAll(',', '')
//                 list = { 'sentence': sumtext, 'count': newData.sentence.allcount, 'rule_based_id': newData.sentence.rule, 'rule_based_name': newData.sentence.name ,'map_id':newData.sentence.map_id}

//                 //     sentent.map(function (num, idx) {
//                 //     for (let n = 0; n < arrrule.length; n++) {
//                 //         if (num == arrrule[n]) {
//                 //             sentent[idx] = num.replaceAll(arrrule[n], '<span style=color:yellow>' + arrrule[n] + '</span>')
//                 //         }
//                 //         if (n+1 == arrrule.length) {
//                 //             var sumtext = sentent.toString()
//                 //     console.log(sumtext);
//                 //     sumtext = sumtext.replaceAll(',', '')
//                 //             list = {'sentence':sumtext,'count':newData.sentence.allcount,'rule_based_id':newData.sentence.rule
//                 //             }
//                 //         }
//                 //     }

//                 // });
//             });
//         }

//         if (err) {
//             result(err, null);
//             return;
//         }
//         setTimeout(async () => {
//             result(null, list);
//         }, 2000);
//     });
// }

Data.getproductkeyword = (newData, result) => {
    // console.log(newData);
    sql.query(`SELECT * FROM product_token WHERE id = "${newData.url}"`, (err, res) => {
        // console.log(res[0]);
        if (res.length != 0) {
            let query = `SELECT a.* FROM advertise a where a.product_token_id = ${res[0].id} order by a.id`;
// console.log(query);
            sql.query(query, async (err, des) => {
                res[0].keyword = des
                var arrrule = []
                // for (let d = 0; d < res[0].keyword.length; d++) {
                //     var jsonkeyword = JSON.parse(res[0].keyword[d].keyword_dict_id)
                //     let keyword_id = jsonkeyword.filter((c, index) => {
                //         return jsonkeyword.indexOf(c) === index;
                //       });
                //     for (let did = 0; did < keyword_id.length; did++) {
                //                 let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where r.dict_id = ${keyword_id[did]}`;
                //         await sql.query(besttoken, async (err, besttokens) => {

                //             var arrrule = []
                //             for (let b = 0; b < besttokens.length; b++) {
                //                 arrrule.push({map_rule_based_id:besttokens[b].map_rule_based_id,
                //                 dict_id:keyword_id[did]})
                //                 console.log(res[0].keyword.length);
                //                 if (d+1 == res[0].keyword.length) {
                //                     res[0].keyword[d].map = arrrule
                //                 }

                //             }

                //         });
                //         }
                // }               

            });
        }

        if (err) {
            result(err, null);
            return;
        }
        setTimeout(async () => {
            result(null, res[0]);
        }, 2000);
    });
}

Data.getproduct = (newData, result) => {
    // console.log(newData);
    sql.query(`SELECT * FROM product_token WHERE id = "${newData.id}"`, (err, res) => {
        // console.log(`SELECT * FROM product_token WHERE id = "${newData.id}"`);
        // console.log(res[0]);
        if (res.length != 0) {
            let query = ''
            // if (newData.fda_status) {
            //     query += `SELECT a.*,m.statusfalse,m.statustrue,mu.id as map_rule_based_userId FROM advertise a join map_rule_based m on a.map_rule_based_id = m.id left join map_rule_based_user mu on a.id = mu.advertiseId where a.product_token_id = ${res[0].id} and mu.userId = ${newData.fda_status}`
            // }else{
                query += `SELECT a.*,m.statusfalse,m.statustrue FROM advertise a join map_rule_based m on a.map_rule_based_id = m.id where a.product_token_id = ${res[0].id}`;
            // }
            query += ' order by a.id'
            // console.log(query);
            sql.query(query, async (err, des) => {

                if (des.length != 0) {
                    
                res[0].keyword = des
                if (newData.fda_status) {
for (let d = 0; d < res[0].keyword.length; d++) {
        let getmap = `SELECT mu.id as map_rule_based_userId , mu.answer as answer FROM map_rule_based_user mu where mu.advertiseId = ${res[0].keyword[d].id} and mu.userId = ${newData.fda_status}`
        sql.query(getmap, async (err, getmaps) => {
            if (getmaps.length > 0) {
                res[0].keyword[d].map_rule_based_userId = getmaps[0].map_rule_based_userId,
                res[0].keyword[d].answer = getmaps[0].answer
            }
        });
    }
}
                var arrrule = []           
            }else{
                res[0].keyword = 1
            }
            });
        }

        if (err) {
            result(err, null);
            return;
        }
        setTimeout(async () => {
            result(null, res[0]);
        }, 2000);
    });
}

Data.getproducttest = (newData, result) => {
    // console.log(newData);
    sql.query(`SELECT * FROM product_token WHERE id = "${newData.id}"`, (err, res) => {
        // console.log(`SELECT * FROM product_token WHERE id = "${newData.id}"`);
        // console.log(res[0]);
        if (res.length != 0) {
            let query = ''
            // if (newData.fda_status) {
            //     query += `SELECT a.*,m.statusfalse,m.statustrue,mu.id as map_rule_based_userId FROM advertise a join map_rule_based m on a.map_rule_based_id = m.id left join map_rule_based_user mu on a.id = mu.advertiseId where a.product_token_id = ${res[0].id} and mu.userId = ${newData.fda_status}`
            // }else{
                query += `SELECT a.*,m.statusfalse,m.statustrue FROM advertise a join map_rule_based m on a.map_rule_based_id = m.id where a.product_token_id = ${res[0].id}`;
            // }
            query += ' order by a.count_rulebased ,a.rule_based_name LIMIT 1'
            console.log(query);
            sql.query(query, async (err, des) => {

                if (des.length != 0) {
                    
                res[0].keyword = des
                var arrrule = []           
            }else{
                res[0].keyword = 1
            }
            });
        }

        if (err) {
            result(err, null);
            return;
        }
        setTimeout(async () => {
            result(null, res[0]);
        }, 500);
    });
}

// Data.getproduct = (newData, result) => {
//     // console.log(newData);
//     sql.query(`SELECT * FROM product_token WHERE url = "${newData.url}"`, (err, res) => {
//         if (res.length != 0) {
//             let query = `SELECT a.* FROM advertise a where a.product_token_id = ${res[0].id}`;
// console.log(query);
// sql.query(query, async (err, des) => {
//     res[0].keyword = des
//     var arrrule = []
//     for (let d = 0; d < res[0].keyword.length; d++) {
//         var jsonkeyword = JSON.parse(res[0].keyword[d].keyword_dict_id)
//         let keyword_id = jsonkeyword.filter((c, index) => {
//             return jsonkeyword.indexOf(c) === index;
//           });
//         var sqlquery = `r.dict_id = `
//         for (let did = 0; did < keyword_id.length; did++) {
//             // console.log(keyword_id[did]);
//                 var arrrule = []
//                 var arrrulename=[]
//                 if (did == 0) {
//                     sqlquery += ` ${keyword_id[did]}`

//                 }
//                 // if (did+1 != keyword_id.length) {
//                     sqlquery += ` or r.dict_id = ${keyword_id[did]}`
//                 // }
//                 if (did+1 == keyword_id.length) {
//                     let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where `;
//             besttoken += sqlquery

// // // console.log(keyword_id[did]);
// // console.log(besttoken);
// // let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where r.dict_id = ${keyword_id[did]}`;
//             await sql.query(besttoken, async (err, besttokens) => {

//                 var arrrule = []
//                 for (let b = 0; b < besttokens.length; b++) {
//                     arrrule.push(besttokens[b].map_rule_based_id)
//                     if (b+1 == besttokens.length) {
//                         res[0].keyword[d].map = arrrule
//                     }

//                 }
// //                 for (let b = 0; b < besttokens.length; b++) {
// //                                         // console.log(did+1);
// //                                         // console.log(besttokens[b].map_rule_based_id);
// //                                         let maprulebase = `SELECT * FROM rule_based where map_rule_based_id = ${besttokens[b].map_rule_based_id} order by no;`;
// //                                     //    console.log(maprulebase);
// //                                        await sql.query(maprulebase, (err, maprulebases) => {
// // // console.log(did+1,keyword_id.length);
// // for (let m = 0; m < maprulebases.length; m++) {
// //                                 // console.log(m+1,maprulebases.length);
// //                                 // arrrulename.push(maprulebases[m].dict_name)
// //                                 arrrule.push(maprulebases[m].dict_id)
// //                                 // console.log(b+1 ,besttokens.length);
// //                                 if (m+1,maprulebases.length && b+1 ,besttokens.length) {
// //                                     console.log((JSON.parse(res[0].keyword[d].keyword_dict_id)).length);
// //                                     res[0].keyword[d].rulebased = arrrule
// //                                     arrrule = []
// //                                 }
// //                             }
// //                 })
// //             }
//             });
//                 }
//                 // console.log(did+1 ,keyword_id.length);
//                 // console.log(arrrule);
//                 // res[0].keyword[d].rule = arrrule
//             }
// // // console.log(keyword_id[did]);
// // // let besttoken = `SELECT r.* FROM rule_based r join dicts d on r.dict_id = d.id join keyword_dicts k on k.name = d.name where r.dict_id = ${keyword_id[did]}`;
// //             await sql.query(besttoken, async (err, besttokens) => {
// // //                 res[0].keyword[d].rulebased = besttokens
// //                 console.log(besttoken);
// //                 for (let b = 0; b < besttokens.length; b++) {
// //                     // console.log(did+1);
// //                     // console.log(besttokens[b].map_rule_based_id);
// //                     let maprulebase = `SELECT * FROM rule_based where map_rule_based_id = ${besttokens[b].map_rule_based_id} order by no;`;
// //                 //    console.log(maprulebase);
// //                    await sql.query(maprulebase, (err, maprulebases) => {

// //                     // console.log(arrrule);
// //                     // res[0].keyword[d].rulebased = maprulebases
// //                     // res[0].keyword[d].rulebasedname = arrrulename
// //                         // for (let m = 0; m < maprulebases.length; m++) {
// //                         //     // console.log(maprulebases[m].map_rule_based_id);
// //                         //     arrrulename.push(maprulebases[m].dict_name)
// //                         //     arrrule.push(maprulebases[m].dict_id)
// //                         // }
// //                 //  console.log(m+1 , maprulebases.length, b+1 , besttokens.length);
// //                 //  console.log((JSON.parse(des[d].dict_id)).length);
// //                 //  console.log(d+1);
// //                 //  console.log(des.length);
// // // console.log(no[d-1]);
// //                 // if (d+1 == des.length && b+1 == besttokens.length && m+1 == maprulebases.length) {
// //                     // console.log(arrrulename);
// //                     // console.log(arrrule);
// //                     // console.log(res[0].keyword[d].dict_id);
// //                     // console.log(d+1);
// //                     // res[0].keyword[d].rulebased = arrrule
// //                     // res[0].keyword[d].rulebasedname = arrrulename
// //                     // arrrule = []
// //                     // arrrulename=[]
// //                         // }

// //                         // }

// //                     })

// //                 }
//             // });

//         // console.log(sql);
//         // console.log(d+1,res[0].keyword.length);
//     }               

// });
//         }

//     if (err) {
//     result(err, null);
//     return;
//     }
//     setTimeout(async () => {
//         // for (let b = 0; b < res[0].keyword.length; b++) {
//         //     var arrrule= []
//         //     for (let m = 0; m < res[0].keyword[b].map.length; m++) {
//         //                                             // console.log(did+1);
//         //                                             // console.log(besttokens[b].map_rule_based_id);
//         //                                             let maprulebase = `SELECT * FROM rule_based where map_rule_based_id = ${res[0].keyword[b].map[m].map_rule_based_id} order by no;`;
//         //                                         //    console.log(maprulebase);
//         //                                            await sql.query(maprulebase, (err, maprulebases) => {
//         //     // console.log(did+1,keyword_id.length);
//         //     for (let mm = 0; mm < maprulebases.length; mm++) {
//         //                                     // console.log(m+1,maprulebases.length);
//         //                                     // arrrulename.push(maprulebases[m].dict_name)
//         //                                     arrrule.push(maprulebases[mm].dict_id)
//         //                                     // console.log(m+1,res[0].keyword[b].map.length);
//         //                                     // console.log(b+1 ,besttokens.length);
//         //                                     if (m+1 == res[0].keyword[b].map.length) {
//         //                                     //     console.log((JSON.parse(res[0].keyword[d].keyword_dict_id)).length);
//         //                                     res[0].keyword[b].rulebased = arrrule
//         //                                     // console.log(res[0].keyword[b].rulebased);
//         //                                         arrrule = []
//         //                                     }
//         //                                 }
//         //                     })
//         //                 }
//         //                 }
// // for (let k = 0; k < res[0].keyword.length; k++) {

// //     var dict_id = JSON.parse(res[0].keyword[k].dict_id)
// //     // console.log(res[0].keyword[k].rulebased);
// //             var arrall =  merge(res[0].rulebased, dict_id);
// //             // console.log('arrrule',arrall);
// //             // console.log('dict_id',dict_id);
// //                         let uniqueChars = arrall.filter((c, index) => {
// //                             return arrall.indexOf(c) === index;
// //                         });
// //                         var sumdictId = uniqueChars
// //                         // console.log('sumdictId',sumdictId);
// //                         // console.log('dict_id',dict_id.length);
// //                         // console.log(sumdictId.length);
// //                         var percentage = (100 * parseInt(sumdictId.length)/parseInt(dict_id.length))
// //                         // console.log(percentage);
// //                         res[0].keyword[k].percentage = percentage
// // }
//         result(null, res[0]);
//     }, 2000);
//     });
//     }

Data.getproduct = (newData, result) => {
    // console.log(newData);
    sql.query(`SELECT * FROM product_token WHERE id = "${newData.id}"`, (err, res) => {
        // console.log(`SELECT * FROM product_token WHERE id = "${newData.id}"`);
        // console.log(res[0]);
        if (res.length != 0) {
            let query = ''
            // if (newData.fda_status) {
            //     query += `SELECT a.*,m.statusfalse,m.statustrue,mu.id as map_rule_based_userId FROM advertise a join map_rule_based m on a.map_rule_based_id = m.id left join map_rule_based_user mu on a.id = mu.advertiseId where a.product_token_id = ${res[0].id} and mu.userId = ${newData.fda_status}`
            // }else{
                query += `SELECT a.*,m.statusfalse,m.statustrue FROM advertise a join map_rule_based m on a.map_rule_based_id = m.id where a.product_token_id = ${res[0].id}`;
            // }
            query += ' order by a.id'
            // console.log(query);
            sql.query(query, async (err, des) => {

                if (des.length != 0) {
                    
                res[0].keyword = des
                if (newData.fda_status) {
for (let d = 0; d < res[0].keyword.length; d++) {
        let getmap = `SELECT mu.id as map_rule_based_userId , mu.answer as answer FROM map_rule_based_user mu where mu.advertiseId = ${res[0].keyword[d].id} and mu.userId = ${newData.fda_status}`
        sql.query(getmap, async (err, getmaps) => {
            if (getmaps.length > 0) {
                res[0].keyword[d].map_rule_based_userId = getmaps[0].map_rule_based_userId,
                res[0].keyword[d].answer = getmaps[0].answer
            }
        });
    }
}
                var arrrule = []           
            }else{
                res[0].keyword = 1
            }
            });
        }

        if (err) {
            result(err, null);
            return;
        }
        setTimeout(async () => {
            result(null, res[0]);
        }, 2000);
    });
}

Data.findAlltest = (name, result) => {
    let query = "SELECT p.*,tr.name as rulename,tp.name as typename FROM product_token p left join type_rulebased tr on p.type_rulebasedId = tr.id left join type_product tp on p.type_productId = tp.id where p.status = 2";
    if (name) {
        query += ` LIMIT ${name}`;
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

Data.getAll = (name, result) => {
    let query = "SELECT p.*,tr.name as rulename,tp.name as typename FROM product_token p left join type_rulebased tr on p.type_rulebasedId = tr.id left join type_product tp on p.type_productId = tp.id where p.status = 2";
    if (name) {
        query += ` LIMIT ${name}`;
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

Data.updatemap = (id, datas, result) => {
    sql.query(
        "UPDATE product_token SET name = ?,fda = ?,product_status = ?,cat_status = ? ,fda_status = ? ,name_status = ? WHERE id = ?",
        [datas.name, datas.fda, datas.product_status, datas.cat_status, datas.fda_status, datas.name_status, id], (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }; result(null, { id: id, ...datas });
        }
    );
};

Data.updateById = (id, datas, result) => {
    // console.log(datas);
    // console.log(id);
        var keyword = JSON.stringify(datas.keyword_id)
    sql.query(
        "UPDATE product_token SET img_path=?,sentencefull=?,keyword_id=?, url = ?,sentence = ?,sentence_keyword = ?,status = ?,type_rulebasedId=?,type_productId=? WHERE id = ?",
        [datas.img_path,datas.sentencefull,keyword,datas.url, datas.sentence, datas.sentence_keyword, datas.status,datas.type_rulebasedId,datas.type_productId, id], (err, res) => {
            if (err) {
                // console.log(err);
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }; result(null, { id: id, ...datas });
        }
    );
};
Data.remove = (id, result) => {
    sql.query(
        "DELETE FROM product_token  WHERE id = ?", id, (err, res) => {
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