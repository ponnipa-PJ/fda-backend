const sql = require("./db");

// constructor
const Case = function(cases) {
  this.no= cases.no;
  this.register_no= cases.register_no;  
  this.brand_name= cases.brand_name;
  this.factory_code= cases.factory_code;
  this.liquor_factory_name= cases.liquor_factory_name;  
  this.factory_address=cases.factory_address; 
  this.number=cases.number; 
  this.degree=cases.degree; 
  this.size=cases.size; 
  this.per_each=cases.per_each; 
  this.volume_liquor=cases.volume_liquor; 
  this.amount_item=cases.amount_item; 
  this.amount=cases.amount; 
  this.book_stamp=cases.book_stamp; 
  this.type=cases.type; 
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO liquor_factories SET ?", newCase, (err, res) => {
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
  sql.query(`SELECT * FROM liquor_factories WHERE id = ${id}`, (err, res) => {
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
  let query = "SELECT type FROM liquor_factories order by id desc";

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

Case.getAll = (name,result) => {
  let query = "SELECT * FROM liquor_factories";

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
    "UPDATE liquor_factories SET name = ?, is_active = ?, updated_by = ?, updated_date = ? WHERE case_type_id = ?",
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
  sql.query("DELETE FROM liquor_factories WHERE case_type_id = ?", id, (err, res) => {
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