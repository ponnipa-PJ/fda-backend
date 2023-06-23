const sql = require("./db");

// constructor
const Case = function(cases) {
  this.excise_id= cases.excise_id;
  this.excise_no= cases.excise_no;
  this.excise_name= cases.excise_name;
  this.excise_by= cases.excise_by;  
  this.industrial_name=cases.industrial_name; 
  this.industrial_no=cases.industrial_no; 
  this.industrial_moo=cases.industrial_moo; 
  this.industrial_district=cases.industrial_district; 
  this.industrial_subdistrict=cases.industrial_subdistrict; 
  this.industrial_province=cases.industrial_province; 
  this.industrial_zipcode=cases.industrial_zipcode; 
  this.registration_date=cases.registration_date; 
  this.status_date=cases.status_date; 
  this.registration_status=cases.registration_status; 
  this.latitude=cases.latitude; 
  this.longitude=cases.longitude; 
  this.coordinate_status=cases.coordinate_status; 
  this.image=cases.image; 
  this.fac_url = cases.fac_url;
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO detail_excise SET ?", newCase, (err, res) => {
    if (err) {
      // console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created cases: ", { id: res.insertId, ...newCase });
    result(null, { id: res.insertId, ...newCase });
  });
};


Case.findByfindCountAll = (id, result) => {
  sql.query(`SELECT COUNT(d.excise_id) as count FROM detail_excise d WHERE (d.registration_status != 'ปิดกิจการ')`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};


Case.findId = (id, result) => {
  sql.query(`SELECT * FROM detail_excise WHERE id = ${id}`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};


Case.findById = (id, result) => {
  sql.query(`SELECT * FROM detail_excise WHERE excise_no = ${id}`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};


Case.findByExciseNo = (id, result) => {
  sql.query(`SELECT * FROM detail_excise WHERE excise_id = '${id}'`, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      //console.log("found casess: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
  });
};

Case.getNullAll = (name,result) => {
  let query = "SELECT * FROM detail_excise WHERE latitude is NULL";

  if (name) {
    query += ` WHERE brand_name LIKE '%${name}%'`;
  }
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


Case.getCount = (name,result) => {
  let query = "SELECT count(d.excise_no) AS countexcise,count(r.excise_no) AS count, r.excise_no FROM detail_excise d left join report r on d.excise_id = r.excise_no WHERE d.registration_status = 'ดำเนินกิจการ' group by r.excise_no;";

  if (name) {
    query += ` WHERE excise_name LIKE '%${name}%'`;
  }
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

Case.getMapAll = (name,result) => {
  // let query = "SELECT d.excise_no,d.excise_id,d.excise_name,d.longitude,d.latitude FROM detail_excise d join merge_liquor_report m on m.factory_code = d.excise_no GROUP BY d.excise_no";
  var date = new Date()
  var m =date.getMonth() + 1
  var y = date.getFullYear() +543
  let query = `SELECT d.excise_no,d.excise_id,d.excise_name,d.longitude,d.latitude,sum(m.number) as number FROM detail_excise d left join merge_liquor_report m on m.factory_code = d.excise_no where month(m.tax_payment_date) = ${m} and year(m.tax_payment_date) = ${y}  GROUP BY d.excise_no;`
  if (name) {
    query += ` WHERE excise_name LIKE '%${name}%'`;
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

Case.getExciseNo = (name,lon,lat,result) => {
  let query = "SELECT * FROM detail_excise";

    query += ` WHERE excise_name = '${name}'`
    query += ` and ABS(latitude-${lat}) < 0.001 and ABS(longitude-${lon}) < 0.001`

// console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    // //console.log("case_types: ", res);
    result(null, res[0]);
  });
};

Case.getAll = (name,by,sort,registration_status,result) => {
  let query = "SELECT * FROM detail_excise d";

  if (name != '' && by != '' && registration_status != '') {
    query += ` WHERE d.excise_name LIKE '%${name}%' and d.excise_by LIKE '%${by}%' and d.registration_status = '${registration_status}'`;
  }
  else if (name) {
    query += ` WHERE d.excise_name LIKE '%${name}%'`;
  }
  else if (by) {
    query += ` WHERE d.excise_by LIKE '%${by}%'`;
  }
  else if (registration_status) {
    query += ` WHERE d.registration_status = '${registration_status}'`;
  }
  query += ` order by d.industrial_district,d.industrial_subdistrict,d.excise_id asc`
  // if (sort == 0) {    
  // query += ` order by industrial_district asc`
  // }else if(sort == 1){
  //   query += ` order by industrial_subdistrict asc`
  // }else if(sort == 2){
  //   query += ` order by excise_id asc`
  // }

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


Case.updateImageById = (id, cases, result) => {
  sql.query(
    "UPDATE detail_excise SET image = ? WHERE id = ?",
    [cases.image, id],
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

Case.updateById = (id, cases, result) => {
  sql.query(
    "UPDATE detail_excise SET excise_id = ?, excise_no = ?, excise_name = ?, excise_by = ?, industrial_name = ?, industrial_no = ?, industrial_moo = ?, industrial_subdistrict = ?, industrial_district = ?, industrial_province = ?, industrial_zipcode = ?, registration_date = ?, status_date = ?, registration_status = ?, latitude = ?, longitude = ?, coordinate_status = ?, image = ?,fac_url=? WHERE id = ?",
    [cases.excise_id, cases.excise_no, cases.excise_name, cases.excise_by, cases.industrial_name, cases.industrial_no, cases.industrial_moo, cases.industrial_subdistrict, cases.industrial_district, cases.industrial_province, cases.industrial_zipcode, cases.registration_date, cases.status_date, cases.registration_status, cases.latitude, cases.longitude, cases.coordinate_status, cases.image,cases.fac_url, id],
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
  sql.query("DELETE FROM detail_excise WHERE case_type_id = ?", id, (err, res) => {
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
  sql.query("DELETE FROM detail_excise", (err, res) => {
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