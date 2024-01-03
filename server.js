const express = require("express");
const fileUpload = require('express-fileupload');
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
const fetch = require("cross-fetch");

var corsOptions = {
  origin: "*"
};
dicts = []
keywords_id = []
keywords_name = []

// set port, listen for requests
const PORT = process.env.PORT || 8081;
const url = 'http://localhost:8081'
// const url = 'https://api-fda.ponnipa.in.th'
// const url = 'https://api-fda.ci2ict.com'

app.use(cors(corsOptions));
app.use(fileUpload());

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(express.static('./'))

var upload = multer({ dest: __dirname + '/uploads/' });
var type = upload.single('upl');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

var dictfile = 'customdict.txt'
dicts = []
arrdicts = []
arrkeyword = []
front = 0
back = 0

async function getdicts(word) {
  dicts = []
  dictid = []
  arrdicts = []
  // console.log(word);
  if (word) {
    dicts.push(word)
  }
  await axios.get(url + '/api/dicts?status=1').then((data) => {
    // console.log(data.data);
    arrdicts = data.data
    for (let d = 0; d < data.data.length; d++) {
      dicts.push(data.data[d].name)
      dictid.push(data.data[d].id)
      
      if (d + 1 == data.data.length) {
        
        // console.log(dicts);
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
async function getsetting() {
  await axios.get(url + '/api/token_setting/1').then((data) => {
    front = data.data.front_space
    back = data.data.back_space
  });
}
async function getkeyword() {
  keywords_id = []
  keywords_name = []
  arrkeyword = []
  await axios.get(url + '/api/keyword_dicts?status=1').then((data) => {
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
  await getdicts(req.query.word)
  await getkeyword()
  await getsetting()
  res.send('cut')
})

// console.log(wordcut.cut("ถ้าเป็นลูกค้าพิมแล้ว ดูแลจนน้ำหนักลดเลยค่ะ สั่งซื้อสินค้าแล้ว ทักแชทมาคุยกันได้เลยค่ะ"));
function intersection(array1, array2) {
  filteredArray = array1.filter(value => array2.includes(value));
  return filteredArray
}
function fdatype(data){
  // console.log(data);
  if (data) {
    var text = ['(']
  var findfda = data
  for (let t = 0; t < text.length; t++) {
    findfda = findfda.substring(findfda.indexOf(0),findfda.indexOf(text[0]));

  }
  }else{
    findfda = ''
  }
  return findfda
}
app.post("/checkfda", async (req, res) => {
  var result = {}
  var statusfda = 0
  // var fda = '1311346550052'
  var fda = req.body.fda
  var content = req.body.content
  var produceng = req.body.produceng
  var productha = req.body.productha
  var typepro = req.body.typepro
  var mapname = ''
  var mapcat = ''
  var mapcatstatus = 0
  var mapnamestatus = 0

  var colorname = 'background-color:#f9bdbb'
  var colorcat = 'background-color:#f9bdbb'
    var name = token(productha+' '+produceng)
    name = name.filter((letter) => letter !== " ");
    var contenttoken = token(content)
    // contenttoken = contenttoken.filter((letter) => letter !== " ");
    var type = fdatype(typepro)
    const uniquekeyword = contenttoken.filter(element => name.includes(element));
  let intersectiondata = uniquekeyword.filter((c, index) => {
    return uniquekeyword.indexOf(c) === index;
  });  
  var indexlist = []
  // console.log(intersectiondata);

  for (let i = 0; i < intersectiondata.length; i++) {
    if (intersectiondata[i]!= 'อาหาร' && intersectiondata[i]!= 'ผลิตภัณฑ์' && intersectiondata[i]!= 'เสริม' && intersectiondata[i]!= 'เครื่องดื่ม' && intersectiondata[i]!= 'ชนิด' && intersectiondata[i]!= '(' && intersectiondata[i]!= ')') {
      // console.log(intersectiondata[i]);
      allindex = getAllIndexes(contenttoken, intersectiondata[i])
        for (let a = 0; a < allindex.length; a++) {
          // indexlist.push(allindex[0])
          indexlist.push(allindex[a])
        }
    }
  }
  // console.log('indexlist',indexlist);
  var countarray = 0
  var listarr = ''
  // console.log(contenttoken);
  for (let u = 0; u < indexlist.length; u++) {
    // console.log(countarray,indexlist[u]);
    if (countarray < indexlist[u]) {
      // console.log(indexlist[u]);
      var backward = findbackward(contenttoken, indexlist[u], 2)
      // console.log(backward);
      // console.log(contenttoken[backward]);
      var findindexfore = contenttoken.slice([backward], indexlist[u])
      // var findindexlastname = contenttoken.slice(indexlist[u],contenttoken.length)
      // console.log(findindexfore);
      var forward = findcutfront(contenttoken, indexlist[u], 3)
      // var findindexback = contenttoken.slice(indexlist[u], forward)
      // console.log(contenttoken[forward]);
      // console.log(findindexback);
      var arrtoken = findindexfore.concat(forward);
      // console.log(arrtoken);
      listarr = arrtoken
      countarray = forward
    }
  }
  // console.log(listarr);
  mapname = listarr.toString()
  mapname = mapname.replaceAll(',', '')

  for (let k = 0; k < intersectiondata.length; k++) {
    mapname = mapname.replaceAll(intersectiondata[k], '<span style="color:red">' + intersectiondata[k] + '</span>')
  }
  // console.log(mapname);
  if (mapname) {
    mapnamestatus = 1
    colorname = "background-color:#a3e9a4"
  }
  const uniquecatall = contenttoken.filter(element => type.includes(element));
  let uniquecat = uniquecatall.filter((c, index) => {
    return uniquecatall.indexOf(c) === index;
  }); 
  if (uniquecat.length > 0) {
    mapcat = type
    mapcatstatus = 1
    colorcat = "background-color:#a3e9a4"
  }
//     console.log(mapname);
// console.log(uniquecat);
//     console.log(contenttoken);
//     console.log(type);
// axios.post(urls + '/api/dicts?status=1',data).then((res) => {
//   console.log(res.data);
// });
  res.json({'name':mapname,
  'mapnamestatus':mapnamestatus,
'category':mapcat,
'mapcatstatus':mapcatstatus,
'token':contenttoken,
'colorname':colorname,
'colorcat':colorcat
})
});

app.get("/token", async (req, res) => {
// console.log(dicts);
  var cut = await token(req.query.text)
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
  await getkeyword()
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
  // console.log(uniquekeyword);
  let intersectiondata = uniquekeyword.filter((c, index) => {
    return uniquekeyword.indexOf(c) === index;
  });  
  // console.log(intersectiondata);

  sumtext = name_result.toString()
  sumtext = sumtext.replaceAll(',', '')
  // console.log(sumtext);
  for (let k = 0; k < intersectiondata.length; k++) {
    sumtext = sumtext.replaceAll(intersectiondata[k], '<span style="color:red">' + intersectiondata[k] + '</span>')

  }
  var keywords = getKeywordIdbyDicts(intersectiondata,arrkeyword)
  // console.log(keywords);
  let uniqueindex = keywords.filter((c, index) => {
    return keywords.indexOf(c) === index;
  });
// console.log(uniqueindex);

  res.json({sentent:sumtext,keywordId:uniqueindex});
});

function token(text) {
  // console.log(dicts);
  wordcut.init(dictfile, true);
  var name_result = wordcut.cutIntoArray(text)
  // var result = name_result.filter((letter) => letter !== " ");
// console.log(name_result);
  return name_result
}
function getAllIndexes(arr, val) {
  var indexes = [], i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
  }
  return indexes;
}
app.post("/checkkeyword", async (req, res) => {
  await getdicts()
  await getkeyword()
  await getsetting()
  // console.log(keywords_name);

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
  // console.log(union);
  var indexlist = []
  for (let n = 0; n < name_result.length; n++) {
    for (let k = 0; k < union.length; k++) {
      if (name_result[n] == union[k]) {
        // console.log(name_result[n]);
        // let index = name_result.indexOf(name_result[n])
        // allindex = getAllIndexes(name_result, name_result[n])
        // for (let a = 0; a < allindex.length; a++) {
          indexlist.push(n+1)
          
        // }
      }
    }
  }
  // console.log(indexlist);
  // console.log(union);
  let uniqueindex = indexlist
  // getAllIndexes(dict_id, mapid[did])
  // let uniqueindex = indexlist.filter((c, index) => {
  //   return indexlist.indexOf(c) === index;
  // });
  // console.log(name_result);
  // console.log(uniqueindex);
  listarr = []
  countarray = 0
  for (let u = 0; u < uniqueindex.length; u++) {
    // console.log(countarray,uniqueindex[u]);
    if (countarray < uniqueindex[u]) {
      // console.log(uniqueindex[u]);
      var backward = findcutfback(name_result, uniqueindex[u], front)
      // var backward = findbackward(name_result, uniqueindex[u], front)
      // console.log(backward);
      // console.log(name_result[backward]);
      // var findindexfore = name_result.slice([backward], uniqueindex[u])
      // var findindexlastname = name_result.slice(uniqueindex[u],name_result.length)
      // console.log(findindexfore);
      var forward = findcutfront(name_result, uniqueindex[u], back)
      var forwardindex = findforward(name_result, uniqueindex[u], back)
      // var findindexback = name_result.slice(uniqueindex[u], forward)
      // console.log(forward);
      // console.log(findindexback);
      var arrtoken = backward.concat(forward);
      // console.log(arrtoken);
      sen = arrtoken.toString()
      sen = sen.replaceAll(',', '')
      // console.log(sen);
      var n = token(sen)
      // console.log('n',n);
      listarr.push(n)
      countarray = forwardindex
    }

  }
  listarr = listarr.filter((c, index) => {
    return listarr.indexOf(c) === index;
  });
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
    dict_name = listarr[li]
    // const dict_name = listarr[li].filter(element => {
    //   return element !== ' ';
    // });
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

function findcutfback(name_result, index, back) {
  // console.log(name_result);
  // console.log(index);
  // console.log(back);
  var newsen = name_result.slice(0,index)
  // console.log(newsen);
var sen = newsen.toString()
// console.log(sen);
sen = sen.replaceAll(',','')
// console.log(sen);
var split = sen.split(" ")
// console.log(split);
split = split.filter(n => n)
// console.log(split);
var arr = []
var list =[]
for (let b = 0; b < back; b++) {
  if (split.length - (b+1)) {
    list.push(split.length - (b+1))
  }
  
}
// console.log(list);
list.sort();
// console.log(list);
// console.log(split);
if (split.length > 0) {
  for (let s = 0; s < list.length; s++) {
    // console.log(split[list[s]]);
    arr.push(split[list[s]])
    if (s+1 != list.length) {
      arr.push(' ')
    }
  }
  // for (let s = 0; s < split.length; s++) {
  //   if (s < back) {
  //     arr.push(split[s])
  //     arr.push(' ')
  //   }
  // }
}
// console.log(arr);
// console.log(arr.toString());
return arr
}

function findcutfront(name_result, index, back) {
  // console.log(name_result);
  // console.log(index);
  // console.log(back);
  var newsen = name_result.slice(index,name_result.length)
  // console.log(newsen);
var sen = newsen.toString()
// console.log(sen);
sen = sen.replaceAll(',','')
// console.log(sen);
var split = sen.split(" ")
// console.log(split);
split = split.filter(n => n)
// console.log(split);
var arr = []
if (split.length > 0) {
  for (let s = 0; s < split.length; s++) {
    if (s < back) {
      arr.push(split[s])
      arr.push(' ')
    }
  }
}
// console.log(split);
// console.log(arr.toString());
return arr
}

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
  // console.log(words);
  var words = words.filter(n => n)
  // console.log(words);
  for (let w = 0; w < words.length; w++) {
    if (words[w] != ' ' && words[w] != '  ' && words[w] != '') {
      // console.log(words[w]);
      await axios.get(url+'/api/dicts?name=' + words[w]).then(async (res) => {
        // console.log(res.data);
        if (res.data.length == 1) {
          // console.log('id',res.data[0].id);
          dictlist.push(res.data[0].id);
        } else {
          // console.log(1);
          var dict = {
            name: words[w],
            status: 1
          }
          // console.log(words[w]);
          await axios.post(url+'/api/dicts', dict).then((res) => {
            // console.log('newid',);
            if (res.data.id) {
              dictlist.push(res.data.id);
              
            }
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
  // console.log(index);
  if (index == 0 ||index == 1) {
    cb = 0
  }else{
  while (bc < setting) {
    cb = index - mb
    // console.log('mb',mb);
    if (cb < (array.length)) {
      // console.log(array[cb]);
      if (array[cb] == ' ' || array[cb] == '   ') {
        bc = bc + 1
      }
      if (cb == 0) {
        bc = bc + 1
      }
    }
    mb = mb + 1
  }
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

app.post('/uploadimg', (req, res) => {

  if (!req.files) {
      return res.status(500).send({ msg: "file is not found" })
  }
  // accessing the file
  const myFile = req.files.file;
  var name = req.query.name
  console.log(name);
  //  mv() method places the file inside public directory
  myFile.mv(`${__dirname}/uploads/img/${name}`, function (err) {
      if (err) {
          console.log(err)
          return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({ name: myFile.name, path: `/${myFile.name}` });
  });
})

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
require("./app/routes/type_product.routes")(app);
require("./app/routes/map_rule_based_user.routes")(app);
require("./app/routes/type_rulebased.routes")(app);


app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}.`);
});