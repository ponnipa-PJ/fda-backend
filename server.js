const express = require("express");
const cors = require("cors");
const base64Img = require('base64-img');
var multer = require('multer');
const puppeteer = require('puppeteer');

const app = express();

var corsOptions = {
  origin: "*"
};


// set port, listen for requests
const PORT = process.env.PORT || 8081;

app.use(cors(corsOptions));

var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(express.static('./uploads'))
app.use("/images", express.static("/uploads/users"));

var upload = multer({ dest: __dirname + '/uploads/' });

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to fda application." });
});

app.get("/scraping", (req, res) => {

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var url = req.query.url
    console.log(url);
    await page.goto(url);
    const textSelector = await page.waitForSelector(
      '.product-detail'
    );
    const fullTitle = await textSelector?.evaluate(el => el.textContent);

    // Print the full title
    // console.log('The title of this blog post is "%s".', fullTitle);
    res.send(fullTitle)
    await browser.close();
  })();
});


require("./app/routes/products.routes")(app);

app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}.`);
});