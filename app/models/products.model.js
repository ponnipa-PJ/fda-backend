const sql = require("./db");
const puppeteer = require('puppeteer');

var natural = require('natural');
const axios = require('axios');
const path = require('path');

const Data = function (datas) {
    this.id=datas.id,this.path = datas.path; this.url = datas.url; this.content = datas.content; this.status = datas.status; this.updated_date = datas.updated_date;
};

Data.findproduct = async (newData, result) => {
            var list = []
    let query = `SELECT * FROM products WHERE url = '${newData.url}'`;
    // console.log(query);
    sql.query(query, (err, res) => {
        // console.log(res[0]);
//         var conten = res[0].content
// var tokenizer = new natural.WordTokenizer();
// console.log(tokenizer.tokenize(conten));

list.push({
id:res[0].id,
path:res[0].path,
image_path:res[0].image_path,
url:res[0].url,
content:res[0].content,
status:res[0].status,
created_date:res[0].created_date,
updated_date:res[0].updated_date,

})
        if (err) {
            result(null, err);
            return;
        }
        result(null, list);
    });
}

Data.findscraping = (newData, result) => {
    console.log(newData);
    let query = `SELECT * FROM products WHERE id = ${newData.id}`;
    
    console.log(query);
    sql.query(query, (err, res) => {
        console.log(res);
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // console.log(res[0].path);
        var paths = 'file:///'+path.resolve("./") +'/'+res[0].path
        // console.log(paths);
        await page.goto(paths);
        const textSelector = await page.waitForSelector(
          '.product-detail', {timeout:0}
        );
        const fullTitle = await textSelector?.evaluate(el => el.textContent);
    
        // Print the full title
        // console.log('The title of this blog post is "%s".', fullTitle);
        result(null, fullTitle);
        await browser.close();
      })();
    });
}

Data.create = (newData, result) => {
    sql.query("INSERT INTO products SET ?", newData, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newData });
    });
}

Data.getAll = (url, result) => {
    let query = "SELECT * FROM products WHERE status = 0";
    if (url) {
        query += ` and url =  '${url}'`;
    }
    console.log(query);
    sql.query(query, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Data.findById = (id, result) => {
    sql.query(`SELECT * FROM products WHERE id = ${id}`, (err, res) => {
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
        "UPDATE products SET content = ?,status = ?,updated_date = ? WHERE id = ?",
        [datas.content, datas.status, new Date(), id], (err, res) => {
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
Data.remove = (id, result) => {
    sql.query(
        "DELETE FROM products  WHERE id = ?", id, (err, res) => {
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
    sql.query("DELETE FROM products", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

module.exports = Data;