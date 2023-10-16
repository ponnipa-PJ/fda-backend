const Data = require("../models/product_token.model.js");


exports.getmapproduct = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    const datas = new Data({
    url:req.body.url,sentence:req.body.sentence,sentence_keyword:req.body.sentence_keyword,status:req.body.status,});
    Data.getmapproduct(datas, (err, data) => {
        console.log(err);
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while creating the Tutorial."
    });
    else res.send(data);
    });
    };

exports.getproduct = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    const datas = new Data({
    url:req.body.url,sentence:req.body.sentence,sentence_keyword:req.body.sentence_keyword,status:req.body.status,});
    Data.getproduct(datas, (err, data) => {
        console.log(err);
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while creating the Tutorial."
    });
    else res.send(data);
    });
    };

exports.create = (req, res) => {
if (!req.body) {
res.status(400).send({
message: 'Content can not be empty!'
});
}

const datas = new Data({
url:req.body.url,sentence:req.body.sentence,sentence_keyword:req.body.sentence_keyword,status:req.body.status,});
Data.create(datas, (err, data) => {
    console.log(err);
if (err)
res.status(500).send({
message:
err.message || "Some error occurred while creating the Tutorial."
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

