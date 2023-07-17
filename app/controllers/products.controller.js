const Data = require("../models/products.model.js");


exports.saveimageproduct = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    const datas = new Data({
        name:req.body.name, id:req.body.id,path:req.body.path,url:req.body.url,content:req.body.content,status:req.body.status,updated_date:req.body.updated_date,});
        console.log(datas);
    Data.saveimageproduct(datas, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while creating the Tutorial."
    });
    else res.send(data);
    });
    };

exports.findscrapingheader = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    const datas = new Data({
        name:req.body.name, id:req.body.id,path:req.body.path,url:req.body.url,content:req.body.content,status:req.body.status,updated_date:req.body.updated_date,});
        console.log(datas);
    Data.findscrapingheader(datas, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while creating the Tutorial."
    });
    else res.send(data);
    });
    };

exports.findscraping = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    const datas = new Data({
        name:req.body.name, id:req.body.id,path:req.body.path,url:req.body.url,content:req.body.content,status:req.body.status,updated_date:req.body.updated_date,});
        console.log(datas);
    Data.findscraping(datas, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while creating the Tutorial."
    });
    else res.send(data);
    });
    };

exports.findproduct = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    const datas = new Data({
    path:req.body.path,url:req.body.url,content:req.body.content,status:req.body.status,updated_date:req.body.updated_date,});
    Data.findproduct(datas, (err, data) => {
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
path:req.body.path,url:req.body.url,content:req.body.content,status:req.body.status,updated_date:req.body.updated_date,});
Data.create(datas, (err, data) => {
if (err)
res.status(500).send({
message:
err.message || "Some error occurred while creating the Tutorial."
});
else res.send(data);
});
};

exports.findAll = (req, res) => {
const url = req.query.url;
// console.log(req.body);
Data.getAll(url, (err, data) => {
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

exports.findproduct = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    Data.findproduct(
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

