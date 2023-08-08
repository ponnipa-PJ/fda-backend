const sql = require("./db");
const puppeteer = require('puppeteer');

var natural = require('natural');
const axios = require('axios');
const path = require('path');

const Data = function (datas) {
    this.cat_fda=datas.cat_fda,this.statusfda=datas.statusfda,this.fda=datas.fda,this.statusdelete=datas.statusdelete,this.image_path=datas.image_path,this.file=datas.file,this.cat_id=datas.cat_id,this.name=datas.name,this.path = datas.path; this.url = datas.url; this.content = datas.content; this.status = datas.status; this.updated_date = datas.updated_date;this.is_fda=datas.is_fda;this.is_cat=datas.is_cat;this.is_name=datas.is_name;
};

Data.findproduct = async (newData, result) => {
            var list = []
    let query = `SELECT p.cat_fda,p.fda,p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p left join category c on p.cat_id = c.id WHERE p.statusdelete = 1 and p.url = '${newData.url}'`;
    console.log(query);
    sql.query(query, async (err, res) => {
        console.log(res);
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
}

Data.findproductfda = async (newData, result) => {
    var list = []
let query = `SELECT p.cat_fda,p.fda,p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p left join category c on p.cat_id = c.id WHERE p.statusdelete = 1 and p.fda = '${newData.fda}'`;
console.log(query);
sql.query(query, async (err, res) => {
console.log(res);


if (err) {
    result(null, err);
    return;
}
result(null, res);
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
        var paths = backend_path+path.resolve("./") +'/'+newData.path
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
        var paths = path.resolve("./") +'/'+newData.path
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
        var paths = backend_path+path.resolve("./") +'/'+newData.path
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

Data.findGraphTwo = (status, result) => {
    console.log(status);
    var list = []
    let query = "SELECT p.created_date,p.cat_fda,p.fda,p.statusfda,p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p left join category c on p.cat_id = c.id";
    // let query = "SELECT * FROM products WHERE status = 0";
    if (status) {
        if (status == 1) {
            query += ` WHERE p.statusdelete = 1 and p.is_fda = true`;
            
        }else if (status == 2){
            query += ` WHERE p.statusdelete = 1 and p.is_cat = true`;

        }else{
            query += ` WHERE p.statusdelete = 1 and p.is_name = true`;
        }
    }
    query += ` order by p.created_date,p.id desc`;
    console.log(query);
    sql.query(query, (err, res) => {
        for (let r = 0; r < res.length; r++) {
            if (res[r].status == 1) {
                axios.get('http://127.0.0.1:5000/base64?id=' + res[r].id).then((im) => {
                res[r].src = 'data:image/jpeg;base64,'+im.data
                // console.log('data:image/jpeg;base64,'+im.data);
                
              });
              
            }
            if (r+1 == res.length) {
                list = res
                // console.log(list);
            }
            
            
        }
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {

            result(null, list);
        }, 1000);
    });
};

Data.getAll = (status,statusdelete,statusfda, result) => {
    console.log(statusfda);
    var list = []
    let query = "SELECT p.created_date,p.cat_fda,p.fda,p.statusfda,p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p left join category c on p.cat_id = c.id";
    // let query = "SELECT * FROM products WHERE status = 0";
    if (status) {
        query += ` WHERE p.statusdelete = 1 and p.status =  ${status}`;
    }
    if (statusdelete) {
        query += ` WHERE p.statusdelete =  ${statusdelete}`;
    }
    if (statusfda) {
        if (statusfda == 3) {
            query += ` WHERE p.statusdelete = 1 and p.statusfda is null`;
            
        }else{
            query += ` WHERE p.statusdelete = 1 and p.statusfda = ${statusfda}`;

        }
    }
    query += ` order by p.created_date,p.id desc`;
    console.log(query);
    sql.query(query, (err, res) => {
        for (let r = 0; r < res.length; r++) {
            if (res[r].status == 1) {
                axios.get('http://127.0.0.1:5000/base64?id=' + res[r].id).then((im) => {
                res[r].src = 'data:image/jpeg;base64,'+im.data
                // console.log('data:image/jpeg;base64,'+im.data);
                
              });
              
            }
            if (r+1 == res.length) {
                list = res
                // console.log(list);
            }
            
            
        }
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {

            result(null, list);
        }, 1000);
    });
};

Data.findById = (id, result) => {
    sql.query(`SELECT p.cat_fda,p.fda,p.id,p.cat_id,p.file,p.path,p.image_path,p.url,p.name,p.content,p.status,c.name as cat_name FROM products p left join category c on p.cat_id = c.id WHERE p.id = ${id} and p.statusdelete = 1`, (err, res) => {
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

Data.updatefdastatus = (id, datas, result) => {
    sql.query(
        "UPDATE products SET is_fda=?,is_cat=?,is_name=?,statusfda=?,cat_fda=?,updated_date = ? WHERE id = ?",
        [datas.is_fda,datas.is_cat,datas.is_name,datas.statusfda,datas.cat_fda, new Date(), id], (err, res) => {
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

Data.updatescraping = (id, datas, result) => {
    console.log("UPDATE products SET fda=?,name=?,content=?,status=?,updated_date = ? WHERE id = ?",
    [datas.fda,datas.name,datas.content,datas.status, new Date(), id]);
    sql.query(
        "UPDATE products SET fda=?,name=?,content=?,status=?,updated_date = ? WHERE id = ?",
        [datas.fda,datas.name,datas.content,datas.status, new Date(), id], (err, res) => {
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
Data.remove = (id,datas, result) => {
    console.log(datas);
    console.log(`UPDATE products SET statusdelete = ${datas.statusdelete} WHERE id = ?`, id);
    sql.query(
        `UPDATE products SET statusdelete = ${datas.statusdelete} WHERE id = ?`, id, (err, res) => {
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