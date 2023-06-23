const express = require("express");
const cors = require("cors");
const base64Img = require('base64-img');
var multer  = require('multer');

const app = express();

var corsOptions = {
    origin: "*"
};


// set port, listen for requests
const PORT = process.env.PORT || 8081;

app.use(cors(corsOptions));

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(express.static('./uploads'))
app.use("/images", express.static("/uploads/users"));

var upload = multer({ dest: __dirname + '/uploads/' });
var type = upload.single('upl');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to excise application." });
});

app.get("/up", (req, res) => {
    res.json({ message: "45 to excise application." });
});

app.post('/upload', (req, res) => {
    const { image } = req.body;
    //console.log(req.body);
    base64Img.img(image, './uploads', new Date(), function(err, filepath) {
      const pathArr = filepath.split('/')
      const fileName = pathArr[pathArr.length - 1];
  
      res.status(200).json({
        success: true,
        url: `http://127.0.0.1:${PORT}/${fileName}`
      })
    });
  });

require("./app/routes/detail_excise.routes.js")(app);
require("./app/routes/report_liquor_tax.routes.js")(app);
require("./app/routes/liquor_factories.routes.js")(app);
require("./app/routes/merge_liquor_report.routes.js")(app);
require("./app/routes/report.routes.js")(app);
require("./app/routes/menu.routes.js")(app);
require("./app/routes/user.routes.js")(app);

app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}.`);
});