const Case = require("../models/detail_excise.model");

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
        excise_id: req.body.excise_id,
        excise_no: req.body.excise_no,
        excise_name: req.body.excise_name,
        excise_by: req.body.excise_by,  
        industrial_name:req.body.industrial_name, 
        industrial_no:req.body.industrial_no, 
        industrial_moo:req.body.industrial_moo, 
        industrial_district:req.body.industrial_district, 
        industrial_subdistrict:req.body.industrial_subdistrict, 
        industrial_province:req.body.industrial_province, 
        industrial_zipcode:req.body.industrial_zipcode, 
        registration_date:req.body.registration_date, 
        status_date:req.body.status_date, 
        registration_status:req.body.registration_status, 
        latitude:req.body.latitude, 
        longitude:req.body.longitude, 
        coordinate_status:req.body.coordinate_status, 
        image:req.body.image, 
        fac_url:req.body.fac_url
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

exports.findNull = (req, res) => {
    const name = req.query.name;

    Case.getNullAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.findCount = (req, res) => {
    const name = req.query.name;

    Case.getCount(name, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

exports.findMapAll = (req, res) => {
    const name = req.query.name;

    Case.getMapAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};


exports.findExciseNo = (req, res) => {
    const name = req.query.name;
    const lon = req.query.lon;
    const lat = req.query.lat;
    Case.getExciseNo(name,lon,lat, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Retrieve all Tutorials from the database (with condition).
exports.findAll = (req, res) => {
    const name = req.query.name;
    const by = req.query.by;
    const sort = req.query.sort;
    const registration_status = req.query.registration_status;
    Case.getAll(name,by,sort,registration_status, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tutorials."
            });
        else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findCountAll = (req, res) => {
    Case.findByfindCountAll(req.params.id, (err, data) => {
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
exports.findById = (req, res) => {
    Case.findId(req.params.id, (err, data) => {
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
                // res.status(404).send({
                //     message: `Not found Tutorial with id ${req.params.id}.`
                // });
            } else {
                res.status(500).send({
                    message: "Error retrieving Tutorial with id " + req.params.id
                });
            }
        } else res.send(data);
    });
};

// Find a single Tutorial with a id
exports.findOneExciseNo = (req, res) => {
    Case.findByExciseNo(req.params.id, (err, data) => {
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

exports.updateImage = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    //console.log(req.body);

    Case.updateImageById(
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