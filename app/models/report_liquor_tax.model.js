const sql = require("./db");

// constructor
const Case = function(cases) {
  this.no= cases.no;
  this.industrial_plant_name= cases.industrial_plant_name;
  this.tax_payment_date= cases.tax_payment_date;
  this.excise_number= cases.excise_number;  
  this.brand_name=cases.brand_name; 
  this.degree=cases.degree; 
  this.packing_size=cases.packing_size; 
  this.number_bottles=cases.number_bottles; 
  this.volume_liquor=cases.volume_liquor; 
  this.liquor_tax=cases.liquor_tax; 
  this.tax_refund=cases.tax_refund; 
  this.net_tax=cases.net_tax ;
  this.type=cases.type ;
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO report_liquor_tax SET ?", newCase, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(err, null);
      return;
    }

    //console.log("created cases: ", { id: res.insertId, ...newCase });
    result(null, { id: res.insertId, ...newCase });
  });
};

Case.findById = (id, result) => {
  sql.query(`SELECT * FROM report_liquor_tax WHERE id = ${id}`, (err, res) => {
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

Case.getTypeAll = (name,result) => {
  let query = "SELECT type FROM report_liquor_tax order by id desc";

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

Case.getmergeAll = (name,result) => {
  let query = "SELECT r.id,r.no,r.tax_payment_date,l.brand_name,l.factory_code,l.number,l.degree,l.size,l.per_each,l.volume_liquor,r.industrial_plant_name ,l.no,l.type FROM liquor_factories l inner join report_liquor_tax r on l.no = r.no GROUP by l.id order by r.no asc";

  if (name) {
    query += ` WHERE l.type > ${name}`;
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

Case.getAll = (name,result) => {
  let query = "SELECT * FROM report_liquor_tax";

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

Case.updateById = (id, cases, result) => {
  sql.query(
    "UPDATE report_liquor_tax SET name = ?, is_active = ?, updated_by = ?, updated_date = ? WHERE case_type_id = ?",
    [cases.name, cases.is_active, cases.updated_by,new Date(), id],
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
  sql.query("DELETE FROM report_liquor_tax WHERE case_type_id = ?", id, (err, res) => {
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
  sql.query("DELETE FROM report_liquor_tax", (err, res) => {
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