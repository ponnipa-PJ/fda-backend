const sql = require("./db");

// constructor
const Case = function (cases) {
  this.no = cases.no;        
  this.excise_no = cases.excise_no;
  this.plan_no = cases.plan_no;
  this.report_date = cases.report_date;        
  this.verify =cases.verify; 
  this.period =cases.period; 
  this.excise_tax =cases.excise_tax; 
  this.fine =cases.fine; 
  this.vat =cases.vat; 
  this.Increased_taxes = cases.Increased_taxes;
  this.sum = cases.sum;
  this.remark = cases.remark;
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO  report SET ?", newCase, (err, res) => {
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
  sql.query(`SELECT * FROM  report WHERE excise_no  = '${id}' ORDER BY report_date DESC`, (err, res) => {
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

Case.getReportAll = (name, result) => {
  // let query = "SELECT * FROM report";
  let query = "SELECT r.excise_no FROM report r join detail_excise d on d.excise_id = r.excise_no;";
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

Case.getAll = (verify, result) => {
  // let query = "SELECT * FROM report";
  let query = ''
  if (verify) {
    query = `SELECT d.excise_id,d.excise_no,d.excise_name,d.industrial_district FROM detail_excise as d WHERE d.registration_status = 'ดำเนินกิจการ' and d.excise_id NOT IN (SELECT excise_no FROM report) order by d.industrial_district,d.excise_name;`;
  }else{
    query = "SELECT count(r.excise_no) as count,d.excise_id,d.excise_no,d.excise_name,d.industrial_district,r.report_date FROM detail_excise as d left join report r on d.excise_id = r.excise_no WHERE d.registration_status = 'ดำเนินกิจการ' group by r.excise_no order by report_date desc;";
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
    "UPDATE  report SET name = ?, is_active = ?, updated_by = ?, updated_date = ? WHERE case_type_id = ?",
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