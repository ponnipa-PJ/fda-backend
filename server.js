const express = require("express");
const cors = require("cors");
const base64Img = require('base64-img');
var multer = require('multer');
// const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const app = express();
const glob = require('glob')
const axios = require('axios');
var expect = require("chai").expect
var wordcut = require("wordcut");

var corsOptions = {
  origin: "*"
};
dicts = []
keywords_id = []
keywords_name = []

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

// var url = 'http://localhost:8081/'

var url = 'https://api-fda.ponnipa.in.th'
getdicts()
getkeyword()
var dictfile = 'customdict.txt'
dicts = []
arrdicts = []
arrkeyword = []
front = 0
back = 0

function getdicts() {
  dicts = []
  dictid = []
  arrdicts = []

  axios.get(url + '/api/dicts?status=1').then((data) => {
    // console.log(data.data);
    arrdicts = data.data
    for (let d = 0; d < data.data.length; d++) {
      dicts.push(data.data[d].name)
      dictid.push(data.data[d].id)
      if (d + 1 == data.data.length) {
        const writeStream = fs.createWriteStream(dictfile);
        const pathName = writeStream.path;

        // console.log(pathName);
        // write each value of the array on the file breaking line
        dicts.forEach(value => writeStream.write(`${value}\n`));

        // the finish event is emitted when all data has been flushed from the stream
        writeStream.on('finish', () => {
          // console.log(`wrote all the array data to file ${pathName}`);
        });

        // handle the errors on the write process
        writeStream.on('error', (err) => {
          console.error(`There is an error writing the file ${pathName} => ${err}`)
        });

        // close the stream
        writeStream.end();
      }
    }
  });
}
function getsetting() {
  axios.get(url + '/api/token_setting/1').then((data) => {
    front = data.data.front_space
    back = data.data.back_space
  });
}
function getkeyword() {
  keywords_id = []
  keywords_name = []
  arrkeyword = []
  axios.get(url + '/api/keyword_dicts?status=1').then((data) => {
    // console.log(data.data);
    arrkeyword = data.data
    for (let d = 0; d < data.data.length; d++) {
      keywords_id.push(data.data[d].id)
      keywords_name.push(data.data[d].name)
    }
  });
}
function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    // /Users/ponnipa/Documents/GitHub/fda-backend/uploads/1_files/th-11134103-22070-cm4o2x7x0ievf0.webp
    if (fs.statSync(name).isDirectory()) {
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

app.get("/loaddict", async (req, res) => {
  getdicts()
  getkeyword()
  getsetting()
  res.send('cut')
})

// console.log(wordcut.cut("ถ้าเป็นลูกค้าพิมแล้ว ดูแลจนน้ำหนักลดเลยค่ะ สั่งซื้อสินค้าแล้ว ทักแชทมาคุยกันได้เลยค่ะ"));
function intersection(array1, array2) {
  filteredArray = array1.filter(value => array2.includes(value));
  return filteredArray
}

app.get("/token", async (req, res) => {
  var cut = token(req.query.text)
  // console.log(cut);
  res.send(cut)
});

function getKeywordIdbyDicts(first_array, second_array) {
  let new_array = [];
  for (let i = 0; i < first_array.length; i++) {
    for (let j = 0; j < second_array.length; j++) {
      if (first_array[i] === second_array[j].name) {
        new_array.push(
          second_array[j].id
        );
      }
    }
  }
  return new_array;
}

app.post("/wordtokendesc", async (req, res) => {
  // var name = req.query.text
  var name = req.body.content
  // console.log(name);
  var name_result = token(name)
  // console.log(name_result);
  // console.log(keywords_name);
  dictkeyall = intersection(name_result, keywords_name)
  // console.log(dictkeyall);
  listfull = []
  const uniquekeyword = name_result.filter(element => keywords_name.includes(element));
  let intersectiondata = uniquekeyword.filter((c, index) => {
    return uniquekeyword.indexOf(c) === index;
  });  
  console.log(intersectiondata);

  sumtext = name_result.toString()
  sumtext = sumtext.replaceAll(',', '')
  for (let k = 0; k < intersectiondata.length; k++) {
    sumtext = sumtext.replaceAll(intersectiondata[k], '<span style="color:red">' + intersectiondata[k] + '</span>')

  }
  var keywords = getKeywordIdbyDicts(intersectiondata,arrkeyword)
  console.log(keywords);
  let uniqueindex = keywords.filter((c, index) => {
    return keywords.indexOf(c) === index;
  });
console.log(uniqueindex);

  res.json({sentent:sumtext,keywordId:uniqueindex});
});

function token(text) {
  wordcut.init(dictfile, true);
  var name_result = wordcut.cutIntoArray(text)
  return name_result
}

app.post("/checkkeyword", async (req, res) => {
  // console.log(front, back);
  var name = req.body.content
  // console.log(name);
  // console.log(req.body);
  var name_result = token(name)
  dictkeyall = intersection(name_result, keywords_name)
  listfull = []
  const result = getIntersection(arrdicts, arrkeyword);
  let union = dictkeyall.filter((c, index) => {
    return dictkeyall.indexOf(c) === index;
  });
  var indexlist = []
  for (let n = 0; n < name_result.length; n++) {
    for (let k = 0; k < union.length; k++) {
      if (name_result[n] == union[k]) {
        // console.log(name_result[n]);
        let index = name_result.indexOf(name_result[n])
        indexlist.push(index)
      }
    }
  }
  // console.log(indexlist);
  let uniqueindex = indexlist.filter((c, index) => {
    return indexlist.indexOf(c) === index;
  });
  // console.log(name_result);
  // console.log(uniqueindex);
  listarr = []
  countarray = 0
  for (let u = 0; u < uniqueindex.length; u++) {
    // console.log(countarray,uniqueindex[u]);
    if (countarray < uniqueindex[u]) {
      // console.log(uniqueindex[u]);
      var backward = findbackward(name_result, uniqueindex[u], front)
      // console.log(backward);
      // console.log(name_result[backward]);
      var findindexfore = name_result.slice([backward], uniqueindex[u])
      // var findindexlastname = name_result.slice(uniqueindex[u],name_result.length)
      // console.log(findindexfore);
      var forward = findforward(name_result, uniqueindex[u], back)
      var findindexback = name_result.slice(uniqueindex[u], forward)
      // console.log(forward);
      // console.log(findindexback);
      var arrtoken = findindexfore.concat(findindexback);
      listarr.push(arrtoken)
      countarray = forward
    }

  }
  // console.log(listarr);
  dict_id = []
  keyword_dict_id = []
  sentent = []
  sen = []
  sumtext = ''
  // console.log(listarr);
  for (let l = 0; l < listarr.length; l++) {
    listfull = []

    let dictall = await createdictsDict(listarr[l]);
    dict_id.push(dictall)
    let uniqueindexkeyword = getDictIdKeyword(listarr[l], result)
    keyword_dict_id.push(uniqueindexkeyword)
  }

  for (let dd = 0; dd < listarr.length; dd++) {
    sumtext = ''
    // console.log(listarr[dd]);
    sumtext = listarr[dd].toString()
    sumtext = sumtext.replaceAll(',', '')
    sumtextsen = listarr[dd].toString()
    sumtextsen = sumtextsen.replaceAll(',', '')
    // console.log(dictkeyall);
    // console.log(sumtext);

    for (let k = 0; k < dictkeyall.length; k++) {
      sumtext = sumtext.replaceAll(dictkeyall[k], '<span style="color:red">' + dictkeyall[k] + '</span>')
      if (k + 1 == dictkeyall.length) {
        sentent.push(sumtext)
        sen.push(sumtextsen)
        sumtext = ''
      }
    }
  }
  // console.log(sentent);
  // console.log(listarr);
  // console.log(dict_id);
  // console.log(keyword_dict_id);

  jsonData = []
  for (let li = 0; li < listarr.length; li++) {
    const dict_name = listarr[li].filter(element => {
      return element !== ' ';
    });
    if (li == 0) {
      jsonData.push({
        keyword_dict_id: keyword_dict_id[li],
        dict_id: dict_id[li],
        dict_name: dict_name,
        sentent: sentent[li],
        sen: sen[li]
      })
    } else {
      var filteredArray = keyword_dict_id[li].filter(function (n) {
        return keyword_dict_id[li - 1].indexOf(n) !== -1;
      });
    }
    // console.log(filteredArray);
    if (filteredArray == undefined) {
      console.log(1);
    } else {
      jsonData.push({
        keyword_dict_id: keyword_dict_id[li],
        dict_id: dict_id[li],
        dict_name: dict_name,
        sentent: sentent[li],
        sen: sen[li]
      })
    }
    // if (filteredArray || filteredArray.length < 1) {
    //   jsonData.push({
    //     keyword_dict_id: keyword_dict_id[li],
    //     dict_id: dict_id[li],
    //     dict_name: listarr[li],
    //     sen: sentence[li]
    //   })
    // }

  }
  // console.log(jsonData);

  res.json(jsonData);
});


function getDictIdKeyword(first_array, second_array) {
  let new_array = [];
  for (let i = 0; i < first_array.length; i++) {
    for (let j = 0; j < second_array.length; j++) {
      if (first_array[i] === second_array[j].name) {
        new_array.push(
          second_array[j].dictId
        );
      }
    }
  }
  return new_array;
}

async function createdictsDict(words) {
  var dictlist = [];
  for (let w = 0; w < words.length; w++) {
    if (words[w] != ' ') {
      await axios.get(url+'/api/dicts?name=' + words[w]).then(async (res) => {
        if (res.data.length > 0) {
          // console.log(res.data[0].id);
          dictlist.push(res.data[0].id);
        } else {
          // console.log(1);
          var dict = {
            name: words[w],
            status: 1
          }
          await axios.post(url+'/api/dicts', dict).then((res) => {
            dictlist.push(res.data.id);
          })
        }
      });
    }
  }
  // console.log(dictlist);
  return dictlist;
}

function findforward(array, index, setting) {
  bc = 0
  mb = 1
  while (bc < setting) {
    cb = index + mb
    if (cb < (array.length)) {
      if (array[cb] == ' ') {
        bc = bc + 1
      }
    }
    else {
      bc = bc + 1
    }
    mb = mb + 1
  }
  return cb + 1
}

function findbackward(array, index, setting) {
  bc = 0
  mb = 1
  while (bc < setting) {
    cb = index - mb
    // console.log('mb',mb);
    if (cb < (array.length)) {
      // console.log(array[cb]);
      if (array[cb] == ' ') {
        bc = bc + 1
      }
      if (cb == 0) {
        bc = bc + 1
      }
    }
    mb = mb + 1
  }

  return cb
}

function getIntersection(first_array, second_array) {
  let new_array = [];
  for (let i = 0; i < first_array.length; i++) {
    for (let j = 0; j < second_array.length; j++) {
      if (first_array[i].name === second_array[j].name) {
        new_array.push({
          keywordId: second_array[j].id,
          dictId: first_array[i].id,
          name: second_array[j].name,
        });
      }
    }
  }
  return new_array;
}

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
  const folder = __dirname + '/' + req.query.path
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
require("./app/routes/keyword_dicts.routes")(app);
require("./app/routes/token_setting.routes")(app);
require("./app/routes/rule_based.routes")(app);
require("./app/routes/map_rule_based.routes")(app);
require("./app/routes/rule_based_keyword.routes")(app);
require("./app/routes/advertise.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/role_menu.routes")(app);
require("./app/routes/menus.routes")(app);
require("./app/routes/roles.routes")(app);
require("./app/routes/product_token.routes")(app);

app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}.`);
});