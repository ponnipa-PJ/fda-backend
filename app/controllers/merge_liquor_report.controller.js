const Case = require("../models/merge_liquor_report.model");

// Create and Save a new Tutorial
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Tutorial
    const cases = new Case({
        no: req.body.no,        
        tax_payment_date: req.body.tax_payment_date,
        brand_name: req.body.brand_name,
        factory_code: req.body.factory_code,        
        number:req.body.number, 
        degree:req.body.degree, 
        size:req.body.size, 
        per_each:req.body.per_each, 
        volume_liquor:req.body.volume_liquor, 
        industrial_plant_name: req.body.industrial_plant_name,
        type: req.body.type,
        liquor_tax: req.body.liquor_tax,
        net_tax: req.body.net_tax,
    });
    // Save Tutorial in the database
    Case.create(cases, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        else res.send(data);
    });
};

exports.detailtax = (req, res) => {
    const factory_code = req.query.factory_code;
    //console.log(req.query);
    Case.getdetailtaxAll(factory_code, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.liquortaxheader = (req, res) => {
    const factory_code = req.query.factory_code;
    //console.log(req.query);
    Case.getliquortaxheaderlAll(factory_code, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.liquortaxdetail = (req, res) => {
    const factory_code = req.query.factory_code;
    //console.log(req.query);
    Case.getliquortaxdetailAll(factory_code, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getsumall = (req, res) => {
    const start = req.query.start;
    const end = req.query.end;
    const code = req.query.code
    Case.getsumall(start,end,code, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.findnottax = (req, res) => {
    const month = req.query.month;
    const year = req.query.year;
    const sort = req.query.sort;
    Case.getnottaxAll(month,year,sort, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.fromdatedetailtax = (req, res) => {
    const factory_code = req.query.factory_code;
    const startdate = req.query.startdate;
    const enddate = req.query.enddate;
    //console.log(req.query);
    Case.getfromdatedetailtaxAll(factory_code,startdate,enddate, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.sortdate = (req, res) => {
    const startdate = req.query.startdate;
    const enddate = req.query.enddate;
    //console.log(req.query);
    Case.getSortAll(startdate,enddate, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.findType = (req, res) => {
    const name = req.query.name;

    Case.getTypeAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getabletax = (req, res) => {
    const name = req.query.name;
    const degree = req.query.degree;
    const size = req.query.size;
    Case.getabletax(name,degree,size, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getlisttax = (req, res) => {
    const name = req.query.name;
    const degree = req.query.degree;
    const size = req.query.size;
    Case.getlisttax(name,degree,size, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getvolume = (req, res) => {
    const name = req.query.name;
    const month = req.query.month;
    const year = req.query.year;
    Case.getvolume(name,month,year, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getnumber = (req, res) => {
    const name = req.query.name;
    const month = req.query.month;
    const year = req.query.year;
    Case.getnumber(name,month,year, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getnettax = (req, res) => {
    const name = req.query.name;
    const month = req.query.month;
    const year = req.query.year;
    Case.getnettax(name,month,year, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getnetall = (req, res) => {
    const name = req.query.name;
    Case.getnetall(name, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getoverall = (req, res) => {
    const name = req.query.name;
    const brand_name = req.query.brand_name;
    const degree = req.query.degree;
    const size = req.query.size;
    Case.getoverall(name,brand_name,degree,size, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.getaxlist = (req, res) => {
    const name = req.query.name;
    const brand_name = req.query.brand_name;
    const degree = req.query.degree;
    const size = req.query.size;
    const month = req.query.month;
    const year = req.query.year;
    Case.getaxlist(name,brand_name,degree,size,month,year, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};
// Retrieve all Tutorials from the database (with condition).
exports.getvolumetax = (req, res) => {
    const name = req.query.name;
    const degree = req.query.degree;
    const size = req.query.size;
    Case.getvolumetax(name,degree,size, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};
// Retrieve all Tutorials from the database (with condition).

exports.getdatagraph = (req, res) => {
    const name = req.query.name;
    const brand_name = req.query.brand_name;
    const degree = req.query.degree;
    const size = req.query.size;
    Case.getdatagraph(name,brand_name ,degree,size, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};
exports.findAll = (req, res) => {
    const name = req.query.name;
    const startdate = req.query.startdate;
    const enddate = req.query.enddate;
    const month = req.query.month;
    const year = req.query.year;
    Case.getAll(name,startdate ,enddate,month,year, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.findValue = (req, res) => {
    Case.findValueByCode(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

exports.findGraph = (req, res) => {
    Case.plotgraph(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findOne = (req, res) => {
    Case.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Update a Tutorial identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //console.log(req.body);

    Case.updateById(
        req.params.id,
        new Case(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Tutorial with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Error updating Tutorial with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    Case.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Tutorial with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Tutorial with id " + req.params.id
                });
            }
        } else res.send({ message: `Tutorial was deleted successfully!` });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Case.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        else res.send({ message: `All Tutorials were deleted successfully!` });
    });
};