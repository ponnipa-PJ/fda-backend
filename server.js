const express = require("express");
const cors = require("cors");
const base64Img = require('base64-img');
var multer = require('multer');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const app = express();
const glob = require('glob')

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
app.use("/uploads", express.static("/uploads"));

var upload = multer({ dest: __dirname + '/uploads/' });


function getFiles (dir, files_){
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files){
      var name = dir + '/' + files[i];
      // /Users/ponnipa/Documents/GitHub/fda-backend/uploads/1_files/th-11134103-22070-cm4o2x7x0ievf0.webp
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}
// console.log(getFiles(__dirname+'/uploads/1_files'))

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


function getFolderSizeByGlob(folder) {
  const filePaths = glob.sync('*webp', { // "**" means you search on the whole folder
      cwd: folder, // folder path 
      absolute: true, // you have to set glob to return absolute path not only file names
  });
  let files = [];
  filePaths.forEach((file) => {
    files.push(file)
      // console.log('file', file);
  });
  return files;
}


app.get("/getimage", (req, res) => {
  const folder = __dirname +'/'+req.query.path
  // console.log(folder);
  result = getFolderSizeByGlob(folder)
    res.send(result)
});

app.get("/img", (req, res) => {
  var image1 = req.query.name
  var base64Img = require('base64-img');
  var imageData1 = base64Img.base64Sync(image1);
  var base64Data = imageData1.replace(/^data:image\/(png|jpeg|jpg||webp);base64,/, '');
  var img = Buffer.from(base64Data, 'base64');

  //   res.writeHead(200, {
  //     'Content-Type': 'image/png',
  //     'Content-Length': img.length
  //   });
  // console.log(imageData1);
  res.json({ base64: imageData1 });
});

require("./app/routes/products.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/dicts.routes")(app);
require("./app/routes/fdatypes.routes")(app);
require("./app/routes/database_path.routes")(app);
require("./app/routes/dashboard.routes")(app);
require("./app/routes/keywords.routes")(app);

app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}.`);
});