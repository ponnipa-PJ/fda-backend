const sql = require("./db");

const Data = function (datas) {
    this.name = datas.name; this.status = datas.status;
};
Data.create = (newData, result) => {
    sql.query("INSERT INTO keyword_dicts SET ?", newData, (err, res) => {
        if (err) {
            //console.log(err);
            result(null, {err: err.errno});
            return;
        }
        result(null, { id: res.insertId, ...newData });
    });
}

Data.mapdictId = (name, result) => {
    let query = "SELECT d.id FROM keyword_dicts k join dicts d on d.name = k.name where k.status = 1";
    if (name) {
        query += ` WHERE status = 1`;
    }
    sql.query(query, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

Data.gettraining = (name, result) => {
    let query = "SELECT * FROM keyword_dicts";
    
        query += ` WHERE status = 1 order by weight desc`;
    
    sql.query(query, (err, res) => {
        for (let k = 0; k < res.length; k++) {
            if (res[k].rulebasedId) {
                var rulearr = JSON.parse(res[k].rulebasedId)
                statustrue = 0
                statusfalse = 0
                for (let r = 0; r < rulearr.length; r++) {
                    let rule = `SELECT * FROM map_rule_based where id = ${rulearr[r]} LIMIT 1`;
                sql.query(rule, (err, rules) => {
                    // console.log(rules[0].statustrue);
                    statustrue = statustrue+rules[0].statustrue
                    statusfalse = statusfalse+rules[0].statusfalse
                    var rulearrlenght = JSON.parse(res[k].rulebasedId).length
                    // console.log(rulearrlenght , r+1);
                    if (rulearrlenght == r+1) {
                        res[k].statustrue = statustrue
                        res[k].statusfalse = statusfalse
                        res[k].total = statusfalse+statustrue
                        statustrue = 0
                statusfalse = 0
                    }
                })  
                }
                
            }
        }
        if (err) { 
            result(null, err);
            return;
        }
        setTimeout(async () => {
            result(null, res);
        }, 500);
    });
};

Data.getAll = (name, result) => {
    let query = "SELECT * FROM keyword_dicts";
    if (name) {
        query += ` WHERE status = 1`;
    }
    sql.query(query, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};
Data.findById = (id, result) => {
    sql.query(`SELECT * FROM keyword_dicts WHERE id = ${id}`, (err, res) => {
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
        "UPDATE keyword_dicts SET name = ?,status = ? WHERE id = ?",
        [datas.name, datas.status, id], (err, res) => {
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
        "DELETE FROM keyword_dicts  WHERE id = ?", id, (err, res) => {
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
    sql.query("DELETE FROM keyword_dicts", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

module.exports = Data;