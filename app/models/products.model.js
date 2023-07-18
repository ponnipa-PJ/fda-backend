const sql = require("./db");
const puppeteer = require('puppeteer');

var natural = require('natural');
const axios = require('axios');
const path = require('path');

const Data = function (datas) {
    this.image_path=datas.image_path,this.file=datas.file,this.cat_id=datas.cat_id,this.name=datas.name,this.path = datas.path; this.url = datas.url; this.content = datas.content; this.status = datas.status; this.updated_date = datas.updated_date;
};

Data.findproduct = async (newData, result) => {
            var list = []
    let query = `SELECT * FROM products WHERE url = '${newData.url}'`;
    // console.log(query);
    sql.query(query, async (err, res) => {
//         await axios.get('http://127.0.0.1:5000/worktoken?text=' + res[0].content).then((token) => {
// console.log(token.data);
list.push({
id:res[0].id,
path:res[0].path,
image_path:res[0].image_path,
url:res[0].url,
content:res[0].content,
status:res[0].status,
created_date:res[0].created_date,
updated_date:res[0].updated_date,
name:res[0].name,
// token:token.data
// });
})
        if (err) {
            result(null, err);
            return;
        }
        result(null, list);
    });
}

Data.saveimageproduct = (newData, result) => {
    // console.log(newData);
    let query = `SELECT * FROM products WHERE id = ${newData.id}`;
    
    // console.log(query);
    sql.query(query, (err, res) => {
        // console.log(res);
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // console.log(res[0].path);
        var paths = 'file:///'+path.resolve("./") +'/'+res[0].path
        // console.log(paths);
        await page.setViewport({width:1920,height:1080})
        await page.goto(paths);
        var name = path.resolve("./")+'/uploads/'+ newData.id+'.jpg'
        console.log(name);
        await page.screenshot({path:name})
        
        result(null, 'success');
        await browser.close();
      })();
    });
}

Data.findscrapingheader = (newData, result) => {
    console.log(newData);
    let query = `SELECT * FROM products WHERE id = ${newData.id}`;
    
    // console.log(query);
    sql.query(query, (err, res) => {
        // console.log(res);
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // console.log(res[0].path);
        var paths = 'file:///'+path.resolve("./") +'/'+res[0].path
        // console.log(paths);
        await page.goto(paths);
        const textSelector = await page.waitForSelector(
          '._44qnta', {timeout:0}
        );
        const fullTitle = await textSelector?.evaluate(el => el.textContent);
        result(null, fullTitle);
        await browser.close();
      })();
    });
}

Data.findscraping = (newData, result) => {
    // console.log(newData);
    let query = `SELECT * FROM products WHERE id = ${newData.id}`;
    
    // console.log(query);
    sql.query(query, (err, res) => {
        // console.log(res);
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
        result(null, fullTitle);
        await browser.close();
      })();
    });
}

Data.create = (newData, result) => {
    sql.query("INSERT INTO products SET ?", newData, (err, res) => {    
        console.log(err);

        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newData });
    });
}

Data.getAll = (url, result) => {
    let query = "SELECT p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p join category c on p.cat_id = c.id";
    // let query = "SELECT * FROM products WHERE status = 0";
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
    sql.query(`SELECT p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p join category c on p.cat_id = c.id WHERE p.id = ${id}`, (err, res) => {
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
        "UPDATE products SET file=?,cat_id=?,path=?,image_path=?,url=?,status = ?,updated_date = ? WHERE id = ?",
        [datas.file,datas.cat_id,datas.path,datas.image_path,datas.url, datas.status, new Date(), id], (err, res) => {
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