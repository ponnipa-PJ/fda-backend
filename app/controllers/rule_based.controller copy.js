const Data = require("../models/rule_based.model.js");
// const axios = require('axios');

// columns = []
// axios.get('http://localhost:8081/api/rule_based/getcolumn').then((data) => {
//                 // console.log(data.data);
//                 for (let d = 0; d < data.data.length; d++) {
//                 columns.push(data.data[d].COLUMN_NAME+':'+'req.body.'+data.data[d].COLUMN_NAME)
//                 }
//                 console.log(columns);

//               });
// console.log(columns);
exports.create = (req, res) => {
if (!req.body) {
res.status(400).send({
message: 'Content can not be empty!'
});
}

const datas = new Data({
data:req.body});
Data.create(datas, (err, data) => {
if (err)
res.status(500).send({
message:
err.message || "Some error occurred while creating the Tutorial."
});
else res.send(data);
});
};

exports.createcolumn = (req, res) => {
    const name = req.query.name;
    Data.createcolumn(name, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while retrieving table."
    });
    else res.send(data);
    });
    };

exports.getcolumn = (req, res) => {
    const name = req.query.name;
    Data.getcolumn(name, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while retrieving table."
    });
    else res.send(data);
    });
    };
    
    exports.getbymap = (req, res) => {
        const name = req.query.name;
        Data.getbymap(name, (err, data) => {
        if (err)
        res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving table."
        });
        else res.send(data);
        });
        };
    exports.getbydict = (req, res) => {
        const name = req.query.name;
        Data.getbydict(name, (err, data) => {
        if (err)
        res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving table."
        });
        else res.send(data);
        });
        };
exports.findAll = (req, res) => {
const name = req.query.name;
Data.getAll(name, (err, data) => {
if (err)
res.status(500).send({
message:
err.message || "Some error occurred while retrieving table."
});
else res.send(data);
});
};
exports.findOne = (req, res) => {
Data.findById(req.params.id, (err, data) => {
if (err) {
if (err.kind === "not_found") {
res.send([])
}
} else res.send(data);
});
};
exports.update = (req, res) => {
if (!req.body) {
res.status(400).send({
message: 'Content can not be empty!'
});
}

Data.updateById(
req.params.id,
new Data(req.body),
(err, data) => {
if (err) {
if (err.kind === "not_found") {
res.send([]);
}
} else res.send(data);
}
);
};

exports.delete = (req, res) => {
Data.remove(req.params.id, (err, data) => {
if (err) {
if (err.kind === "not_found") {
res.send([])
}
} else res.send({ message: `Data was deleted successfully!` });
});
};

exports.deleteAll = (req, res) => {
Data.removeAll((err, data) => {
if (err)
res.status(500).send({
message:
err.message || "Some error occurred while removing all tutorials."
});
else res.send({ message: `All Datas was deleted successfully!` });
});
};

