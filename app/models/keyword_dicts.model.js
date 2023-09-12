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