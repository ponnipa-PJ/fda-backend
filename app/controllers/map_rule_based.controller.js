const Data = require("../models/map_rule_based.model.js");

exports.create = (req, res) => {
if (!req.body) {
res.status(400).send({
message: 'Content can not be empty!'
});
}

const datas = new Data({
    map_dict:req.body.map_dict,answer:req.body.answer,status:req.body.status,advertise_id:req.body.advertise_id,user:req.body.user,keyword_id:req.body.keyword_id});
Data.create(datas, (err, data) => {
if (err)
res.status(500).send({
message:
err.message || "Some error occurred while creating the Tutorial."
});
else res.send(data);
});
};

exports.getallrulebased = (req, res) => {
    const ad_id = req.query.ad_id;
    const user = req.query.user;
    Data.getallrulebased(ad_id,user, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while retrieving table."
    });
    else res.send(data);
    });
    };

exports.findadanduser = (req, res) => {
    const ad_id = req.query.ad_id;
    const user = req.query.user;
    Data.findadanduser(ad_id,user, (err, data) => {
    if (err)
    res.status(500).send({
    message:
    err.message || "Some error occurred while retrieving table."
    });
    else res.send(data);
    });
    };
    
    exports.checkintb = (req, res) => {
        const name = req.query.name;
        Data.checkintb(name, (err, data) => {
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

exports.updateanswer = (req, res) => {
    if (!req.body) {
    res.status(400).send({
    message: 'Content can not be empty!'
    });
    }
    
    Data.updateanswer(
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
    
    exports.updateweight = (req, res) => {
        if (!req.body) {
        res.status(400).send({
        message: 'Content can not be empty!'
        });
        }
        
        Data.updateweight(
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
        if (!req.body) {
        res.status(400).send({
        message: 'Content can not be empty!'
        });
        }
        
        Data.remove(
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

