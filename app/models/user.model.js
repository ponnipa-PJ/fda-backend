const sql = require("./db");
const config = require("../config/auth.config");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
// constructor
const Case = function (cases) { 
  this.username = cases.username;
  this.password = cases.password; 
  this.firstname_lastname = cases.firstname_lastname; 
  this.role_id = cases.role_id; 
  this.status	 = cases.status	;
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO  user SET ?", newCase, (err, res) => {
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
  sql.query(`SELECT * FROM  user WHERE key  = '${id}'`, (err, res) => {
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

Case.signin = (req, result) => {
  // console.log(`SELECT * from users WHERE username = '${req.username}'`);
  sql.query(`SELECT * from users WHERE username = '${req.username}'`, (err, res) => {
    if (err) {
      // //console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      // console.log(res[0]);
      // //console.log("found user: ", res[0]);

      var passwordIsValid = bcrypt.compareSync(
        req.password,
        res[0].password
      );
      if (passwordIsValid) {
        var token = jwt.sign({ id: res[0].id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
        data = {
          id: res[0].id,
          username: res[0].username,
          role_id: res[0].role_id,
          accessToken:token
        }
        result(null, data);
        return;
      }else{
        result({ kind: "not_found" }, null);
      }
    }else{

    // not found Tutorial with the id
    result({ kind: "not_found" }, null);
    }
  });
};

Case.getKey = (key, result) => {
  // let query = "SELECT * FROM report";
  let query = "SELECT * FROM user";
  if (key) {
    query += ` WHERE user_key = '${key}'`;
  }
  // console.log(query);
  sql.query(query, (err, res) => {
    if (err) {
      //console.log("error: ", err);
      result(null, err);
      return;
    }

    //console.log("case_types: ", res);
    result(null, res[0]);
  });
};

Case.getAll = (name, result) => {
  // let query = "SELECT * FROM report";
  let query = "SELECT * FROM user WHERE status = 0";
  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
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
    "UPDATE  user SET username = ?,password = ? ,device = ? ,u_id = ?,status = ? ,created_by = ? ,updated_by = ?,updated_date = ?   WHERE user_id  = ?",
    [cases.username,cases.password,cases.device,cases.u_id,cases.status,cases.created_by,cases.updated_by,Date.now(), id],
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
  sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
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
  sql.query("DELETE FROM user", (err, res) => {
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