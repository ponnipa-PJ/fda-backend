const sql = require("./db");
const puppeteer = require('puppeteer')

// constructor
const Case = function (cases) {
  this.name = cases.name;        
  this.link = cases.link;
  this.no = cases.no;
};

Case.create = (newCase, result) => {
  sql.query("INSERT INTO  menu SET ?", newCase, (err, res) => {
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
  sql.query(`SELECT * FROM  menu WHERE id  = ${id}`, (err, res) => {
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

async function scrape(url) {
  const browser = await puppeteer.launch({})
  const page = await browser.newPage()

  await page.goto(url);
  var element = await page.waitForSelector(".product-detail")
  var text = await page.evaluate(element => element.textContent, element)
  browser.close()
  return text
}

Case.getdetailproduct = (url, result) => {
  var url =url
  scrape(url).then(function(res){
// console.log(res);
result(null, res);
  });
    // setTimeout(() => {
    //   console.log(listfda);
    //   result(null, listfda);
    // }, 500);
};

Case.getAll = (name, result) => {
  // let query = "SELECT * FROM report";
  let query = "SELECT * FROM menu";
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
    "UPDATE  menu SET name = ? WHERE id = ?",
    [cases.name, id],
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
  sql.query("DELETE FROM menu WHERE id = ?", id, (err, res) => {
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
  sql.query("DELETE FROM menu", (err, res) => {
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