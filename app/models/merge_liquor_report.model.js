const sql = require("./db");

// constructor
const Case = function (cases) {
  this.no = cases.no;
  this.tax_payment_date = cases.tax_payment_date;
  this.brand_name = cases.brand_name;
  this.factory_code = cases.factory_code;
  this.number = cases.number;
  this.degree = cases.degree;
  this.size = cases.size;
  this.per_each = cases.per_each;
  this.volume_liquor = cases.volume_liquor;
  this.industrial_plant_name = cases.industrial_plant_name;
  this.type = cases.type;
  this.liquor_tax = cases.liquor_tax;
  this.net_tax = cases.net_tax;
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO merge_liquor_report SET ?", newCase, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created cases: ", { id: res.insertId, ...newCase });
    result(null, { id: res.insertId, ...newCase });
  });
};

Case.findValueByCode = (id, result) => {
  let check = `SELECT Month(tax_payment_date) as month ,Year(tax_payment_date) as year, brand_name,degree,size,sum(case when size = '0.33' then number end) as 'threethree', 
sum(case when size = '0.625' then number end) as 'sixtwofive', 
sum(case when size = '0.63' then number end) as 'sixthree', 
sum(case when size = '0.7' then number end) as 'seven', 
sum(case when size = '0.75' then number end) as 'sevenfive',sum(number) as sumnumber from merge_liquor_report WHERE factory_code = ${id} GROUP by Month(tax_payment_date),Year(tax_payment_date) order BY tax_payment_date asc`;
  sql.query(check, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res);
      result(null, res);
      return;
    }
    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Case.plotgraph = (id, result) => {
  var d = new Date()
  var year = d.getFullYear()+543
  // SELECT * FROM `merge_liquor_report` WHERE `factory_code` = 542047 and (Month(`tax_payment_date`) >= 1 and Year(`tax_payment_date`) >= 2566 or Month(`tax_payment_date`) >= 10 and Year(`tax_payment_date`) = 2565) ORDER BY `merge_liquor_report`.`tax_payment_date` DESC;
  let check = `SELECT brand_name,degree,size , CONCAT('[', GROUP_CONCAT(CONCAT(ml.number)), ']') as number FROM merge_liquor_report ml WHERE ml.factory_code = ${id} and (Month(tax_payment_date) >= 1 and Year(tax_payment_date) >= ${year} or Month(tax_payment_date) >= 10 and Year(tax_payment_date) = ${year-1}) GROUP by ml.brand_name,ml.size,ml.degree`;
  // console.log(check);
  sql.query(check, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res);
      result(null, res);
      return;
    }
    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Case.findById = (id, result) => {
  sql.query(`SELECT * FROM merge_liquor_report WHERE factory_code  = ${id}`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res);
      result(null, res);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Case.getdetailtaxAll = (factory_code, result) => {
  let query = "SELECT Month(tax_payment_date) as month ,Year(tax_payment_date) as year, brand_name,degree,size,sum(number) as summunber,sum(volume_liquor) as sumvolume_liquor from merge_liquor_report";
  // //console.log(startdate);
  if (factory_code) {
    query += ` WHERE factory_code = '${factory_code}' GROUP by Month(tax_payment_date),Year(tax_payment_date),size ORDER BY Year(tax_payment_date),Month(tax_payment_date) ,size ASC`;
  }
  // //console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res);
    result(null, res);
  });
};

Case.getliquortaxheaderlAll = (factory_code, result) => {
  let query = "SELECT brand_name,degree,size from merge_liquor_report";
  // //console.log(startdate);
  if (factory_code) {
    query += ` WHERE factory_code = '${factory_code}' GROUP by size,degree ORDER BY size ASC`;
  }
  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res);
    result(null, res);
  });
};


Case.getliquortaxdetailAll = (factory_code, result) => {
  let query = "SELECT Month(tax_payment_date) as month,year(tax_payment_date) as year, brand_name,size,number,degree,volume_liquor,per_each,net_tax,liquor_tax as net FROM merge_liquor_report";
  // //console.log(startdate);
  if (factory_code) {
    query += ` WHERE factory_code = '${factory_code}' ORDER BY year(tax_payment_date),Month(tax_payment_date),size`;
  }
  // //console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res);
    result(null, res);
  });
};


Case.getsumall = (start, end, code, result) => {

  let query = `SELECT sum(number) as summunber ,sum(volume_liquor) as sumvolume_liquor,sum(net_tax) as sumtax from merge_liquor_report where factory_code = '${code}' and tax_payment_date > '${start}' and tax_payment_date < '${end}' LIMIT 1;`

  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    result(null, res[0]);
  });
};

Case.getnottaxAll = (month, year, sort, result) => {
  if (month.length == 1) {
    month = '0' + month
  }

  var startmonth = year + '-' + month + '-01'
  var endmonth = year + '-' + month + '-31'

  let query = "SELECT DISTINCT `detail_excise`.`excise_id`,`detail_excise`.`excise_no`,`detail_excise`.`industrial_name` as excise_name,`detail_excise`.`industrial_district` FROM `detail_excise` JOIN `merge_liquor_report` WHERE `detail_excise`.`excise_no` NOT IN (SELECT DISTINCT `merge_liquor_report`.`factory_code` FROM `merge_liquor_report` WHERE `merge_liquor_report`.`tax_payment_date`"
  query += ` >= '${startmonth}' `
  query += " and `merge_liquor_report`.`tax_payment_date` "
  query += ` <= '${endmonth}') `
  query += "AND `detail_excise`.`registration_status` = 'ดำเนินกิจการ' OR (`detail_excise`.`registration_status` = 'ปิดกิจการ' AND `detail_excise`.`status_date` >= "
  query += `'${startmonth}')`;
  // //console.log(startdate);
  if (sort == 0) {
    query += ` order by industrial_district,industrial_subdistrict,excise_id asc`
  } else if (sort == 1) {
    query += ` order by industrial_subdistrict asc`
  } else if (sort == 2) {
    query += ` order by excise_id asc`
  }

  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    result(null, res);
  });
};

Case.getfromdatedetailtaxAll = (factory_code, startdate, enddate, result) => {
  let query = "SELECT Month(tax_payment_date) as month ,Year(tax_payment_date) as year, brand_name,degree,size,sum(number) as summunber,sum(volume_liquor) as sumvolume_liquor from merge_liquor_report";
  // //console.log(startdate);
  if (startdate) {
    query += ` WHERE factory_code = ${factory_code} and tax_payment_date >= '${startdate}' and tax_payment_date <= '${enddate}' GROUP by Month(tax_payment_date),Year(tax_payment_date),size,degree ORDER BY Year(tax_payment_date),Month(tax_payment_date) ,size ASC`;
  }
  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res);
    result(null, res);
  });
};

Case.getSortAll = (startdate, enddate, result) => {
  let query = "SELECT * FROM merge_liquor_report";
  // //console.log(startdate);
  if (startdate) {
    query += ` WHERE tax_payment_date >= '${startdate}' && tax_payment_date <= '${enddate}' order by type asc,tax_payment_date desc,  no asc`;
  }
  //console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res);
    result(null, res);
  });
};

function calpercentage(x, y) {
  var r = 0;
  const ischeck = Number.isInteger(x);
  if (ischeck) {
    var a = x / y;
    r = parseFloat(a * 100).toFixed(2);
    // console.log(r);
    if (r == Infinity) {
      r = (0).toFixed(2);
    }
    if (isNaN(r)) {
      r = (0).toFixed(2);
    }
  } else {
    r = (0).toFixed(2);
  }
  return r;
}

Case.getabletax = (name, degree, size, result) => {
  var listtax = []
  let querylist = `SELECT * FROM merge_liquor_report WHERE factory_code = '${name}'`
  sql.query(querylist, (err, list) => {
    // console.log(list);
    monthlist = [{ m: 10, n: 'ตุลาคม' }, { m: 11, n: 'พฤศจิกายน' }, { m: 12, n: 'ธันวาคม' }, { m: 1, n: 'มกราคม' }, { m: 2, n: 'กุมภาพันธ์' }, { m: 3, n: 'มีนาคม' }, { m: 4, n: 'เมษายน' }, { m: 5, n: 'พฤษภาคม' }, { m: 6, n: 'มิถุนายน' }, { m: 7, n: 'กรกฎาคม' }, { m: 8, n: 'สิงหาคม' }, { m: 9, n: 'กันยายน' }]
    date = new Date()
    year = date.getFullYear() + 543

    mon = date.getMonth() +1
    monthtax = []
    // console.log(mon);
    // mon = 9
    // console.log(mon);
    if (mon == 10) {
      monthtax.push({
        m: 10, 
        n: 'ตุลาคม'
      })
      year = year +1
    }else if (mon == 11) {
      monthtax.push({
        m: 10, 
        n: 'ตุลาคม'
      })
      monthtax.push({
        m: 11, 
        n: 'พฤศจิกายน'
      })
      year = year +1
    }else if (mon == 12) {
      monthtax.push({
        m: 10, 
        n: 'ตุลาคม'
      })
      monthtax.push({
        m: 11, 
        n: 'พฤศจิกายน'
      })
      monthtax.push({
        m: 12, 
        n: 'ธันวาคม'
      })
      year = year +1
    }else{
    for (let mm = 0; mm < monthlist.length; mm++) {
      if (monthlist[mm].m <= mon || monthlist[mm].m == 10 || monthlist[mm].m == 11 || monthlist[mm].m == 12) {
        monthtax.push({
          m: monthlist[mm].m, 
          n: monthlist[mm].n
        })
      }      
    }
  }
    listtax=[{y:year,style:
      "background: rgb(119, 182, 234) !important; color: rgb(119, 182, 234); height: 12px; width: 12px; left: 0px; top: 0px; border-width: 0px; border-color: rgb(255, 255, 255); border-radius: 12px;"},
      {y:year-1,style:
        "background: rgb(236, 124, 48) !important; color: rgb(236, 124, 48); height: 12px; width: 12px; left: 0px; top: 0px; border-width: 0px; border-color: rgb(255, 255, 255); border-radius: 12px;"}]
    // console.log(listtax);
    if (name) {
      for (let yy = 0; yy < listtax.length; yy++) {    
      for (let m = 0; m < monthtax.length; m++) {    
        if (mon == 10 || mon == 11 || mon == 12) {
          y = listtax[yy].y
        }    
        else if (monthtax[m].m == 10 || monthtax[m].m == 11 || monthtax[m].m == 12) {
          y = listtax[yy].y - 1
        } else {
          y = listtax[yy].y
        }
        let taxquery = "select sum(volume_liquor) as volume_liquor FROM merge_liquor_report";
        taxquery += ` WHERE factory_code = '${name}'`;
        taxquery += ` && Month(tax_payment_date) = ${monthtax[m].m} && Year(tax_payment_date) = ${y} LIMIT 1`;
        // console.log(month[m].m,y);
        sql.query(taxquery, (err, list) => {
          // console.log(list);
          if (!list[0].volume_liquor || !list) {
            list[0].volume_liquor = 0
          }
              // console.log(listtax[yy].y , y);
              if (monthtax[m].m == 1) {
                listtax[yy].jan = list[0].volume_liquor
              }else if (monthtax[m].m == 2) {
                listtax[yy].feb = list[0].volume_liquor
              }else if (monthtax[m].m == 3) {
                listtax[yy].mar = list[0].volume_liquor
              }else if (monthtax[m].m == 4) {
                listtax[yy].apr = list[0].volume_liquor
              }else if (monthtax[m].m == 5) {
                listtax[yy].may = list[0].volume_liquor
              }else if (monthtax[m].m == 6) {
                listtax[yy].jun = list[0].volume_liquor
              }else if (monthtax[m].m == 7) {
                listtax[yy].jul = list[0].volume_liquor
              }else if (monthtax[m].m == 8) {
                listtax[yy].aug = list[0].volume_liquor
              }else if (monthtax[m].m == 9) {
                listtax[yy].sep = list[0].volume_liquor
              }else if (monthtax[m].m == 10) {
                listtax[yy].oct = list[0].volume_liquor
              }else if (monthtax[m].m == 11) {
                listtax[yy].nov = list[0].volume_liquor
              }else if (monthtax[m].m == 12) {
                listtax[yy].dec = list[0].volume_liquor
              }
        }
        )
      }
    }
    }

    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    setTimeout(() => {

      result(null, listtax);
    }, 1000);
  });
};

Case.getlisttax = (name, degree, size, result) => {
  var listtax = []
  var d = new Date()
  var year = d.getFullYear()+543
  // SELECT * FROM `merge_liquor_report` WHERE `factory_code` = 542047 and (Month(`tax_payment_date`) >= 1 and Year(`tax_payment_date`) >= 2566 or Month(`tax_payment_date`) >= 10 and Year(`tax_payment_date`) = 2565) ORDER BY `merge_liquor_report`.`tax_payment_date` DESC;

  let querylist = `SELECT * FROM merge_liquor_report WHERE factory_code = '${name}' and (Month(tax_payment_date) >= 1 and Year(tax_payment_date) >= ${year} or Month(tax_payment_date) >= 10 and Year(tax_payment_date) = ${year-1}) group by brand_name,degree,size order by brand_name,degree,size`
  sql.query(querylist, (err, list) => {
    // console.log(list);
    month = [{ m: 10, n: 'ตุลาคม' }, { m: 11, n: 'พฤศจิกายน' }, { m: 12, n: 'ธันวาคม' }, { m: 1, n: 'มกราคม' }, { m: 2, n: 'กุมภาพันธ์' }, { m: 3, n: 'มีนาคม' }, { m: 4, n: 'เมษายน' }, { m: 5, n: 'พฤษภาคม' }, { m: 6, n: 'มิถุนายน' }, { m: 7, n: 'กรกฎาคม' }, { m: 8, n: 'สิงหาคม' }, { m: 9, n: 'กันยายน' }]
    date = new Date()
    year = date.getFullYear() + 543
    if (name) {
      for (let m = 0; m < month.length; m++) {        
        if (month[m].m == 10 || month[m].m == 11 || month[m].m == 12) {
          y = year - 1
        } else {
          y = year
        }
        let taxquery = "SELECT sum(number) as number,sum(volume_liquor) as volume_liquor,sum(net_tax) as tax FROM merge_liquor_report";
        taxquery += ` WHERE factory_code = '${name}'`;
        taxquery += ` && Month(tax_payment_date) = ${month[m].m} && Year(tax_payment_date) = ${y} LIMIT 1`;
        // console.log(taxquery);
        sql.query(taxquery, (err, tax) => {
          if (month[m].m == 10 || month[m].m == 11 || month[m].m == 12) {
            yy = year - 2
          } else {
            yy = year - 1
          }
          let taxafterquery = "SELECT sum(number) as number,sum(volume_liquor) as volume_liquor,sum(net_tax) as tax FROM merge_liquor_report";
          taxafterquery += ` WHERE factory_code = '${name}'`;
          taxafterquery += ` && Month(tax_payment_date) = ${month[m].m} && Year(tax_payment_date) = ${yy} LIMIT 1`;
          // console.log(taxafterquery);
          sql.query(taxafterquery, (err, taxafter) => {
          if (!tax[0].tax) {
            tax[0].tax = 0
          }
          if (!tax[0].number) {
            tax[0].number = 0
          }
          if (!tax[0].volume_liquor) {
            tax[0].volume_liquor = 0
          }
          if (!taxafter[0].tax) {
            taxafter[0].tax = 0
          }
          if (!taxafter[0].number) {
            taxafter[0].number = 0
          }
          if (!taxafter[0].volume_liquor) {
            taxafter[0].volume_liquor = 0
          }
          month[m].tax = tax[0].tax
          listtax.push({
            month: month[m].n,
            colour:'font-weight: bold',
            style:'font-weight: bold;background-color: #dae2f3; text-align: right',
            styleafter:'font-weight: bold;background-color: #fff1cc; text-align: right',
            styledif:'font-weight: bold;background-color: #e1efd9; text-align: right',
            numbercurrent:tax[0].number,
            volumecurrent:tax[0].volume_liquor,
            tax:tax[0].tax,
            numberafter:taxafter[0].number,
            volumeafter:taxafter[0].volume_liquor,
            taxafter:taxafter[0].tax,
            diffnumber:tax[0].number-taxafter[0].number,
            diffvolumecurrent:tax[0].volume_liquor-taxafter[0].volume_liquor,
            difftax:tax[0].tax-taxafter[0].tax,
            percent:calpercentage(tax[0].number-taxafter[0].number,taxafter[0].number)
          })
          for (let l = 0; l < list.length; l++) {
            // console.log(l);.
            
            listtax.push({
              month: list[l].brand_name + '-' + list[l].degree + '-' + list[l].size,
              m:month[m].m,
              brand_name:list[l].brand_name,
              degree:list[l].degree,
              size:list[l].size
            })
            if (month[m].m == 10 || month[m].m == 11 || month[m].m == 12) {
              y = year - 1
            } else {
              y = year
            }

            // console.log(y,month[m].m);
            let query = "SELECT sum(number) as number,sum(volume_liquor) as volume_liquor,sum(net_tax) as tax FROM merge_liquor_report";
            query += ` WHERE factory_code = '${name}'`;
            query += ` && Month(tax_payment_date) = ${month[m].m} && Year(tax_payment_date) = ${y} && brand_name = '${list[l].brand_name}' && size = ${list[l].size} && degree = ${list[l].degree} LIMIT 1`;
            // console.log(query);
            sql.query(query, (err, res) => {
              if (month[m].m == 10 || month[m].m == 11 || month[m].m == 12) {
                yy = year - 2
              } else {
                yy = year - 1
              }
              let queryafter = "SELECT sum(number) as number,sum(volume_liquor) as volume_liquor,sum(net_tax) as tax FROM merge_liquor_report";
              queryafter += ` WHERE factory_code = '${name}'`;
              queryafter += ` && Month(tax_payment_date) = ${month[m].m} && Year(tax_payment_date) = ${yy} && brand_name = '${list[l].brand_name}' && size = ${list[l].size} && degree = ${list[l].degree} LIMIT 1`;
            // console.log(query);
            sql.query(queryafter, (err, resafter) => {
              var numberafter = 0
              var volumeafter = 0
              if (resafter) {
                numberafter = resafter[0].number
                volumeafter = resafter[0].volume_liquor
              }
              // if (!resafter[0].number) {
              //   resafter[0].number = 0
              // }
              // if (!resafter[0].volume_liquor) {
              //   resafter[0].volume_liquor = 0
              // }
              var number = 0
              var volume = 0
              // console.log(res);
              if (res) {
                number = res[0].number
                volume = res[0].volume_liquor
              }
              for (let li = 0; li < listtax.length; li++) {
                if (listtax[li].brand_name == list[l].brand_name && listtax[li].size == list[l].size && listtax[li].degree == list[l].degree && listtax[li].m == month[m].m) {                  
                  listtax[li].style='background-color: #dae2f3; text-align: right',
                  listtax[li].styleafter='background-color: #fff1cc; text-align: right',
                  listtax[li].styledif='background-color: #e1efd9; text-align: right',
                  listtax[li].numbercurrent=number,
                  listtax[li].volumecurrent=volume,
                  listtax[li].numberafter=numberafter,
                  listtax[li].volumeafter=volumeafter,
                  listtax[li].diffnumber=number-numberafter,
                  listtax[li].diffvolumecurrent=volume-volumeafter,
                  listtax[li].difftax=''
                  listtax[li].percent= ''
                  // listtax[li].percent=calpercentage(res[0].number-resafter[0].number,resafter[0].number)
                }                
              }   
            });         
            });
          }
        });
        });
      }
    }

    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    setTimeout(() => {

      result(null, listtax);
    }, 1000);
  });
};

Case.getnetall = (name, result) => {
  var d = new Date()
  var year = d.getFullYear()+543
  // SELECT * FROM `merge_liquor_report` WHERE `factory_code` = 542047 and (Month(`tax_payment_date`) >= 1 and Year(`tax_payment_date`) >= 2566 or Month(`tax_payment_date`) >= 10 and Year(`tax_payment_date`) = 2565) ORDER BY `merge_liquor_report`.`tax_payment_date` DESC;
  
  let query = `SELECT sum(net_tax) as net_tax,sum(number) as number,sum(volume_liquor) as volume FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) >= 1 and Year(tax_payment_date) >= ${year} or Month(tax_payment_date) >= 10 and Year(tax_payment_date) = ${year-1}) LIMIT 1`;

  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res[0]);
    result(null, res[0]);
  });
};

Case.getoverall = (name,brand_name,degree,size, result) => {
  var d = new Date()
  var year = d.getFullYear()+543
  // SELECT * FROM `merge_liquor_report` WHERE `factory_code` = 542047 and (Month(`tax_payment_date`) >= 1 and Year(`tax_payment_date`) >= 2566 or Month(`tax_payment_date`) >= 10 and Year(`tax_payment_date`) = 2565) ORDER BY `merge_liquor_report`.`tax_payment_date` DESC;
  
  let query = `SELECT sum(number) as num,sum(volume_liquor) as vol,sum(net_tax) FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) >= 1 and Year(tax_payment_date) >= ${year} or Month(tax_payment_date) >= 10 and Year(tax_payment_date) = ${year-1}) and brand_name = '${brand_name}'  and degree = ${degree}  and size = ${size} LIMIT 1`;

  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res[0]);
    result(null, res[0]);
  });
};

Case.getaxlist = (name,brand_name,degree,size,month,year, result) => {
  var d = new Date()
  var year = d.getFullYear()+543
  var taxdatalist = []
  // SELECT * FROM `merge_liquor_report` WHERE `factory_code` = 542047 and (Month(`tax_payment_date`) >= 1 and Year(`tax_payment_date`) >= 2566 or Month(`tax_payment_date`) >= 10 and Year(`tax_payment_date`) = 2565) ORDER BY `merge_liquor_report`.`tax_payment_date` DESC;

  let query = `SELECT * FROM merge_liquor_report WHERE factory_code = '${name}' and (Month(tax_payment_date) >= 1 and Year(tax_payment_date) >= ${year} or Month(tax_payment_date) >= 10 and Year(tax_payment_date) = ${year-1}) group by brand_name,degree,size order by brand_name,degree,size`
 
  // let query = `SELECT sum(number) as num,sum(volume_liquor) as vol,sum(net_tax) FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${month}  and Year(tax_payment_date) = ${year}) and brand_name = '${brand_name}'  and degree = ${degree}  and size = ${size} LIMIT 1`;

  sql.query(query, (err, res) => {

    var date = new Date()
    var year = date.getFullYear()+543
taxdatalist = [{ m: 10, n: 'ตุลาคม', y:year-1}, { m: 11, n: 'พฤศจิกายน', y:year-1 }, { m: 12, n: 'ธันวาคม', y:year-1 }, { m: 1, n: 'มกราคม', y:year }, { m: 2, n: 'กุมภาพันธ์' , y:year}, { m: 3, n: 'มีนาคม', y:year }, { m: 4, n: 'เมษายน' , y:year}, { m: 5, n: 'พฤษภาคม', y:year }, { m: 6, n: 'มิถุนายน' , y:year}]
var list = []  
for (let r = 0; r < res.length; r++) {
     for (let t = 0; t < taxdatalist.length; t++) {
       let tax = `SELECT sum(number) as num,sum(volume_liquor) as vol,sum(net_tax) FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${taxdatalist[t].m}  and Year(tax_payment_date) = ${taxdatalist[t].y}) and brand_name = '${res[r].brand_name}'  and degree = ${res[r].degree}  and size = ${res[r].size} LIMIT 1`;
       sql.query(tax, (err, taxs) => {
        var num = taxs[0].num
              var vol = taxs[0].vol
        num = num == null ? 0 : num;
        vol = vol == null ? 0 : vol;
        if (taxdatalist[t].m == 10) {
          res[r].octnum = num
          res[r].octvol = vol
        }
        if (taxdatalist[t].m == 11) {
          res[r].novnum = num
          res[r].novvol = vol
        }
        if (taxdatalist[t].m == 12) {
          res[r].decnum = num
          res[r].decvol = vol
        }
        if (taxdatalist[t].m == 1) {
          res[r].jannum = num
          res[r].janvol = vol
        }
        if (taxdatalist[t].m == 2) {
          res[r].febnum = num
          res[r].febvol = vol
        }
        if (taxdatalist[t].m == 3) {
          res[r].marnum = num
          res[r].marvol = vol
        }
        if (taxdatalist[t].m == 4) {
          res[r].aprnum = num
          res[r].aprvol = vol
        }
        if (taxdatalist[t].m == 5) {
          res[r].maynum = num
          res[r].mayvol = vol
        }
        if (taxdatalist[t].m == 6) {
          res[r].junnum = num
          res[r].junvol = vol
        }
       });
     }
      
    }
    var oct = []
              var nov = []
              var dec = []
              var jan = []
              var feb = []
              var mar = []
              var apr = []
              var may = []
              var jun = []
    
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res[0]);
    setTimeout(() => {
      // console.log(months);
      for (let t = 0; t < taxdatalist.length; t++) {
        for (let r = 0; r < res.length; r++) {
            if(taxdatalist[t].m == 10){
              oct.push(res[r].octnum)
              oct.push(res[r].octvol)
            }
            if(taxdatalist[t].m == 11){
              nov.push(res[r].novnum)
              nov.push(res[r].novvol)
            }
            if(taxdatalist[t].m == 12){
              dec.push(res[r].decnum)
              dec.push(res[r].decvol)
            }
            if(taxdatalist[t].m == 1){
              jan.push(res[r].jannum)
              jan.push(res[r].janvol)
            }
            if(taxdatalist[t].m == 2){
              feb.push(res[r].febnum)
              feb.push(res[r].febvol)
            }
            if(taxdatalist[t].m == 3){
              mar.push(res[r].marnum)
              mar.push(res[r].marvol)
            }
            if(taxdatalist[t].m == 4){
              apr.push(res[r].aprnum)
              apr.push(res[r].aprvol)
            }
            if(taxdatalist[t].m == 5){
              may.push(res[r].maynum)
              may.push(res[r].mayvol)
            }
            if(taxdatalist[t].m == 6){
              jun.push(res[r].junnum)
              jun.push(res[r].junvol)
            }
        }
      }
  
      for (let tt = 0; tt < taxdatalist.length; tt++) {
        if(taxdatalist[tt].m == 10){
          taxdatalist[tt].data = oct
          }
          if(taxdatalist[tt].m == 11){
            taxdatalist[tt].data = nov
          }
          if(taxdatalist[tt].m == 12){
            taxdatalist[tt].data = dec
          }
          if(taxdatalist[tt].m == 1){
            taxdatalist[tt].data = jan
          }
          if(taxdatalist[tt].m == 2){
            taxdatalist[tt].data = feb
          }
          if(taxdatalist[tt].m == 3){
            taxdatalist[tt].data = mar
          }
          if(taxdatalist[tt].m == 4){
            taxdatalist[tt].data = apr
          }
          if(taxdatalist[tt].m == 5){
            taxdatalist[tt].data = may
          }
          if(taxdatalist[tt].m == 6){
            taxdatalist[tt].data = jun
          }
        
      }
            result(null, taxdatalist);
          }, 500);
        });
};

Case.getvolume = (name,month,year, result) => {
  var list =[]
  let query = `SELECT sum(net_tax) as tax FROM merge_liquor_report WHERE factory_code = ${name} `;
  var date = new Date()
      var year = date.getFullYear() + 543
  var taxdatalist = [{ m: 10, n: 'ตุลาคม', y: year - 1 }, { m: 11, n: 'พฤศจิกายน', y: year - 1 }, { m: 12, n: 'ธันวาคม', y: year - 1 }, { m: 1, n: 'มกราคม', y: year }, { m: 2, n: 'กุมภาพันธ์', y: year }, { m: 3, n: 'มีนาคม', y: year }, { m: 4, n: 'เมษายน', y: year }, { m: 5, n: 'พฤษภาคม', y: year }, { m: 6, n: 'มิถุนายน', y: year }]
for (let t = 0; t < taxdatalist.length; t++) {
  let sumtax = `SELECT sum(volume_liquor) as volume FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${taxdatalist[t].m}  and Year(tax_payment_date) = ${taxdatalist[t].y}) LIMIT 1`;
  // console.log(sumtax);
  sql.query(sumtax, (err, sumtaxs) => {
    // console.log(sumtaxs);
    var tax = 0
    if (sumtaxs) {
      tax = sumtaxs[0].volume
    }else{
      tax = 0
    }
    list.push(tax)
  });
}
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    setTimeout(() => {
      // console.log(months);
            result(null, list);
          }, 1000);
  });
};

Case.getnumber = (name,month,year, result) => {
  var list =[]
  let query = `SELECT sum(net_tax) as tax FROM merge_liquor_report WHERE factory_code = ${name} `;
  var date = new Date()
      var year = date.getFullYear() + 543
  var taxdatalist = [{ m: 10, n: 'ตุลาคม', y: year - 1 }, { m: 11, n: 'พฤศจิกายน', y: year - 1 }, { m: 12, n: 'ธันวาคม', y: year - 1 }, { m: 1, n: 'มกราคม', y: year }, { m: 2, n: 'กุมภาพันธ์', y: year }, { m: 3, n: 'มีนาคม', y: year }, { m: 4, n: 'เมษายน', y: year }, { m: 5, n: 'พฤษภาคม', y: year }, { m: 6, n: 'มิถุนายน', y: year }]
for (let t = 0; t < taxdatalist.length; t++) {
  let sumtax = `SELECT sum(number) as number FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${taxdatalist[t].m}  and Year(tax_payment_date) = ${taxdatalist[t].y}) LIMIT 1`;
  // console.log(sumtax);
  sql.query(sumtax, (err, sumtaxs) => {
    // console.log(sumtaxs);
    var tax = 0
    if (sumtaxs) {
      tax = sumtaxs[0].number
    }else{
      tax = 0
    }
    list.push(tax)
  });
}
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    setTimeout(() => {
      // console.log(months);
            result(null, list);
          }, 1000);
  });
};

Case.getnettax = (name,month,year, result) => {
  var list = []
  let query = `SELECT sum(net_tax) as tax FROM merge_liquor_report WHERE factory_code = ${name} `;
  var date = new Date()
      var year = date.getFullYear() + 543
  var taxdatalist = [{ m: 10, n: 'ตุลาคม', y: year - 1 }, { m: 11, n: 'พฤศจิกายน', y: year - 1 }, { m: 12, n: 'ธันวาคม', y: year - 1 }, { m: 1, n: 'มกราคม', y: year }, { m: 2, n: 'กุมภาพันธ์', y: year }, { m: 3, n: 'มีนาคม', y: year }, { m: 4, n: 'เมษายน', y: year }, { m: 5, n: 'พฤษภาคม', y: year }, { m: 6, n: 'มิถุนายน', y: year }]
for (let t = 0; t < taxdatalist.length; t++) {
  let sumtax = `SELECT sum(net_tax) as tax FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${taxdatalist[t].m}  and Year(tax_payment_date) = ${taxdatalist[t].y}) LIMIT 1`;
  // console.log(sumtax);
  sql.query(sumtax, (err, sumtaxs) => {
    // console.log(sumtaxs);
    var tax = 0
    if (sumtaxs) {
      tax = sumtaxs[0].tax
    }else{
      tax = 0
    }
    list.push(tax)
  });
}
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    setTimeout(() => {
      // console.log(months);
            result(null, list);
          }, 1000);
  });
};

// Case.getaxlist = (name,brand_name,degree,size, result) => {
//   var data = []
//   var monthlist = []
//   let query = `SELECT * FROM merge_liquor_report WHERE factory_code = ${name}`;
      
//   monthlist = []
//   date = new Date()
//   year = date.getFullYear()+543
//     monthlists = [{ m: 10, n: 'ตุลาคม', y:year-1}, { m: 11, n: 'พฤศจิกายน', y:year-1 }, { m: 12, n: 'ธันวาคม', y:year-1 }, { m: 1, n: 'มกราคม', y:year }, { m: 2, n: 'กุมภาพันธ์' , y:year}, { m: 3, n: 'มีนาคม', y:year }, { m: 4, n: 'เมษายน' , y:year}, { m: 5, n: 'พฤษภาคม', y:year }, { m: 6, n: 'มิถุนายน' , y:year}
//     // , { m: 7, n: 'กรกฎาคม', y:year }, { m: 8, n: 'สิงหาคม' , y:year}, { m: 9, n: 'กันยายน', y:year }
//   ]

//     for (let m = 0; m < monthlists.length; m++) {
//       let heads = `SELECT * FROM merge_liquor_report WHERE factory_code = ${name} group by brand_name,degree,size order by brand_name,degree,size`;
//       var datalitems = []
//       sql.query(heads, (err, head) => {
//         for (let h = 0; h < head.length; h++) {
//           let datas = `SELECT sum(number) as num,sum(volume_liquor) as vol FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${monthlists[m].m}  and Year(tax_payment_date) = ${monthlists[m].y}) and brand_name = '${head[h].brand_name}'  and degree = ${head[h].degree}  and size = ${head[h].size} `;
//       // console.log(datas);
//       sql.query(datas, (err, datalist) => {
//         // console.log(datalist);
//         num = 0
//         if (datalist) {
//           if (datalist[0].num == null) {
//             num = 0
//           }else{
//             num = datalist[0].num
//           }
//         }
//         vol = 0
//         if (datalist) {
//           if (datalist[0].vol == null) {
//             vol = 0
//           }else{
//             vol = datalist[0].vol
//           }
//         }
//         datalitems.push(num)
//         // datalitems.push(vol)
//         console.log(datalitems);
//       });
//         }
//         datalitems = []
//         console.log(datalitems);
//         monthlist.push({m:monthlists[m].n,
//         data:data})
      
//       });
//     }
//   // console.log(query);
//   sql.query(query, (err, res) => {
//     if (err) {
//       // //console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     // //console.log("case_types: ", res);
//     result(null, monthlist);
//   });
// };

Case.getvolumetax = (name, degree, size, result) => {
  let querylist = `SELECT * FROM merge_liquor_report WHERE factory_code = '${name}' group by brand_name,degree,size order by brand_name,degree,size`
  sql.query(querylist, (err, list) => {
    // console.log(list);
    monthlist = []
    monthlist = [{ m: 10, n: 'ตุลาคม' }, { m: 11, n: 'พฤศจิกายน' }, { m: 12, n: 'ธันวาคม' }, { m: 1, n: 'มกราคม' }, { m: 2, n: 'กุมภาพันธ์' }, { m: 3, n: 'มีนาคม' }, { m: 4, n: 'เมษายน' }, { m: 5, n: 'พฤษภาคม' }, { m: 6, n: 'มิถุนายน' }, { m: 7, n: 'กรกฎาคม' }, { m: 8, n: 'สิงหาคม' }, { m: 9, n: 'กันยายน' }]
    date = new Date()
    year = date.getFullYear() + 543

    mon = date.getMonth() +1
    // mon = 9
    var months = []
    // console.log(mon);
    if (mon == 10) {
      months.push({
        m: 10, 
        n: 'ตุลาคม'
      })
      year = year +1
    }else if (mon == 11) {
      months.push({
        m: 10, 
        n: 'ตุลาคม'
      })
      months.push({
        m: 11, 
        n: 'พฤศจิกายน'
      })
      year = year +1
    }else if (mon == 12) {
      months.push({
        m: 10, 
        n: 'ตุลาคม'
      })
      months.push({
        m: 11, 
        n: 'พฤศจิกายน'
      })
      months.push({
        m: 12, 
        n: 'ธันวาคม'
      })
      year = year +1
    }else{
    for (let mm = 0; mm < monthlist.length; mm++) {
      if (monthlist[mm].m <= mon || monthlist[mm].m == 10 || monthlist[mm].m == 11 || monthlist[mm].m == 12) {
        months.push({
          m: monthlist[mm].m, 
          n: monthlist[mm].n
        })
      }      
    }
  }
// console.log(months);
    if (name) {
      for (let m = 0; m < months.length; m++) {

        if (months[m].m == 10 || months[m].m == 11 || months[m].m == 12) {
          y = year - 1
        } else {
          y = year
        }
        let taxquery = "SELECT sum(net_tax) as tax FROM merge_liquor_report";
        taxquery += ` WHERE factory_code = '${name}'`;
        taxquery += ` && Month(tax_payment_date) = ${months[m].m} && Year(tax_payment_date) = ${y} LIMIT 1`;
        // console.log(taxquery);
        sql.query(taxquery, (err, tax) => {

          if (!tax[0].tax) {
            tax[0].tax = 0
          }
          months[m].tax = tax[0].tax
          for (let l = 0; l < list.length; l++) {
            // console.log(l);.
            if (months[m].m == 10 || months[m].m == 11 || months[m].m == 12) {
              y = year - 1
            } else {
              y = year
            }
            // console.log(y,month[m].m);
            let query = "SELECT sum(number) as number,sum(volume_liquor) as volume_liquor,sum(net_tax) as tax FROM merge_liquor_report";
            query += ` WHERE factory_code = '${name}'`;
            query += ` && Month(tax_payment_date) = ${months[m].m} && Year(tax_payment_date) = ${y} && brand_name = '${list[l].brand_name}' && size = ${list[l].size} && degree = ${list[l].degree} LIMIT 1`;
            // console.log(query);
            sql.query(query, (err, res) => {
              if (!months[m].number) {
                months[m].number = 0
              }
              if (!months[m].volume_liquor) {
                months[m].volume_liquor = 0
              }
              if (l == 0) {
                  months[m].number = res[0].number
                  months[m].volume_liquor = res[0].volume_liquor
              }
              else if (l == 1) {
                  months[m].numbertwo = res[0].number
                  months[m].volume_liquortwo = res[0].volume_liquor
              }
              else if (l == 2) {
                  months[m].numberthree = res[0].number
                  months[m].volume_liquorthree = res[0].volume_liquor
              }
              else if (l == 3) {
                months[m].numberfour = res[0].number
                months[m].volume_liquorfour = res[0].volume_liquor
            }
            else if (l == 4) {
              months[m].numberfive = res[0].number
              months[m].volume_liquorfive = res[0].volume_liquor
          }
            });
          }

        });
      }
    }

    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    setTimeout(() => {
// console.log(months);
      result(null, months);
    }, 1000);
  });
};

Case.getdatagraph = (name, brand_name, degree, size, result) => {
  var data = []
  let query = `SELECT * FROM merge_liquor_report WHERE factory_code = ${name}`;
      
  monthlist = []
  date = new Date()
  year = date.getFullYear()+543
    monthlist = [{ m: 10, n: 'ตุลาคม', y:year-1}, { m: 11, n: 'พฤศจิกายน', y:year-1 }, { m: 12, n: 'ธันวาคม', y:year-1 }, { m: 1, n: 'มกราคม', y:year }, { m: 2, n: 'กุมภาพันธ์' , y:year}, { m: 3, n: 'มีนาคม', y:year }, { m: 4, n: 'เมษายน' , y:year}, { m: 5, n: 'พฤษภาคม', y:year }, { m: 6, n: 'มิถุนายน' , y:year}
    // , { m: 7, n: 'กรกฎาคม', y:year }, { m: 8, n: 'สิงหาคม' , y:year}, { m: 9, n: 'กันยายน', y:year }
  ]

    for (let m = 0; m < monthlist.length; m++) {
      let datas = `SELECT sum(number) as num FROM merge_liquor_report WHERE factory_code = ${name}  and (Month(tax_payment_date) = ${monthlist[m].m}  and Year(tax_payment_date) = ${monthlist[m].y}) and brand_name = '${brand_name}'  and degree = ${degree}  and size = ${size} `;
      // console.log(datas);
      sql.query(datas, (err, datalist) => {
        // console.log(datalist);
        num = 0
        if (datalist[0].num == null) {
          num = 0
        }else{
          num = datalist[0].num
        }
        data.push(num)
        // console.log(data);
      });
    }
  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    result(null, data);
  });
   
};

Case.getAll = (name, startdate, enddate, month, year, result) => {
  let query = "SELECT * FROM merge_liquor_report";

  if (name) {
    query += ` WHERE factory_code = '${name}'`;
    query += ` && tax_payment_date >= '${startdate}' && tax_payment_date <= '${enddate}'`;
  }
  if (month && year) {
    query += ` WHERE month(tax_payment_date) = ${month} and year(tax_payment_date) = ${year}`;
  }

  query += ` order by tax_payment_date desc,factory_code asc ,size asc`;

  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      // //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    result(null, res);
  });
};

Case.getTypeAll = (name, result) => {
  let query = "SELECT type FROM merge_liquor_report order by id desc";

  if (name) {
    query += ` WHERE brand_name LIKE '%${name}%'`;
  }
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res[0]);
    result(null, res[0]);
  });
};

Case.updateById = (id, cases, result) => {
  sql.query(
    "UPDATE merge_liquor_report SET name = ?, is_active = ?, updated_by = ?, updated_date = ? WHERE case_type_id = ?",
    [cases.name, cases.is_active, cases.updated_by, new Date(), id],
    (err, res) => {
      if (err) {
        //console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tutorial with the id
        result({ kind: "not_found" }, null);
        return;
      }

      //console.log("updated cases: ", { id: id, ...cases });
      result(null, { id: id, ...cases });
    }
  );
};

Case.remove = (id, result) => {
  sql.query("DELETE FROM merge_liquor_report WHERE case_type_id = ?", id, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Tutorial with the id
      result({ kind: "not_found" }, null);
      return;
    }

    //console.log("deleted cases with id: ", id);
    result(null, res);
  });
};

Case.removeAll = result => {
  sql.query("DELETE FROM liquor_factories", (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log(`deleted ${res.affectedRows} casess`);
    result(null, res);
  });
};

module.exports = Case;