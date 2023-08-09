const sql = require("./db");
const fs = require('fs');
const dbConfig = require("../config/db.config.js");
const path = require('path');
const e = require("express");

const Data = function (datas) {
    this.name = datas.name;
};

function getFileName(data, filename) {
    // 'files' is an array of the files found in the directory 
    let b = data.filter(item => item.indexOf(filename) > -1);
    return (b[0]);
}

Data.create = (newData, result) => {
    sql.query("INSERT INTO dashboard SET ?", newData, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, { id: res.insertId, ...newData });
    });
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle)
            return true;
    }
    return false;
}

Data.getexcelbyid = (id, result) => {
    // let query = "SELECT * FROM `random` where question_set_id = 6 and status = true order by id LIMIT 5";
    let query = `SELECT r.type,r.id,r.weight,q.question_name,r.question_set_id,r.question_id,(select l.name from level l where r.level = l.id) as level,(select COUNT(atr.id) from answer_training atr where r.question_id = atr.question_id and r.question_set_id = atr.question_set_id and atr.round is null) as notraing FROM random r join question_set q on q.id = r.question_set_id join answer_training ants on r.id = ants.random_id where r.question_set_id = ${id} group by r.id order by r.id`;
    // console.log(query);
    sql.query(query, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
            result(null, res);
    });
//     sql.query(query, (err, res) => {
//         var questionslist = []
//         var answercorrect = []

//         var answerlist = []
//         var anslist = []
//         var answer = []
//         var wronganswer = []
//         var weightno = 0
//         // console.log(res);
//         let manage_training = `SELECT * FROM manage_training`;
//         sql.query(manage_training, (err, train) => {
//             // console.log(train[0].weight);
//             category = '['
//             data = '['
//             for (let q = 0; q < res.length; q++) {
//                 // console.log(res[q].type)
//                 if (res[q].type == 1 || res[q].type == 3) {
//                     question = `SELECT * FROM question_subjecttest s where s.id = ${res[q].question_id}`;
//                 } else if (res[q].type == 2) {
//                     question = `SELECT * FROM question_objectivetest s where s.id = ${res[q].question_id}`;
//                 }
//                 sql.query(question, (err, questions) => {                    
//                     answer=[]
//                     answerlist = []
//                     wronganswer=[]
//                     answercorrect=[]
//                     // console.log(questions[0]);
                    
//                     let ans = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id}`
//                     sql.query(ans, (err, countans) => {
//                         weightno = 0 
//                         countans.forEach(function (element, i) {
//                             // console.log(element.score);
//                                 weightno = weightno + element.score

//                             if (element.answer1) {
//                                 anslist.push(element.answer1)
//                             }
//                             if (element.answer2) {
//                                 anslist.push(element.answer2)
//                             }
//                             if (element.answer3) {
//                                 anslist.push(element.answer3)
//                             }
//                         });
//                         var per = (res[q].weight / res[q].notraing) * 100
//                         var perlevel = per / 100
//                         let levelnews = ''
//                         // console.log(perlevel);
//                         if (perlevel && perlevel != Infinity) {
//                             levelnews = `SELECT l.name,l.id FROM level l where ${perlevel} BETWEEN l.percent_from AND l.percent_to`;
//                         } else {
//                             levelnews = `SELECT l.name,l.id FROM level l where l.id = 1`;
//                         }
//                         // console.log(per,perlevel);
//                         sql.query(levelnews, (err, levelnew) => {
//         var wrongtext = ''
//         var anstext = ''
//         console.log(answercorrect);
//         if (questions[0].type == 1 || questions[0].type == 3) {  
//             if (questions[0].CorrectAns1 && questions[0].CorrectAns1 != '-') {
//                 answercorrect.push(questions[0].CorrectAns1)                                    
//             }
//             if (questions[0].CorrectAns2 && questions[0].CorrectAns2 != '-') {
//                 answercorrect.push(questions[0].CorrectAns2)                                    
//             }
//             if (questions[0].CorrectAns3 && questions[0].CorrectAns3 != '-') {
//                 answercorrect.push(questions[0].CorrectAns3)                                    
//             }
//             if (questions[0].CorrectAns4 && questions[0].CorrectAns4 != '-') {
//                 answercorrect.push(questions[0].CorrectAns4)                                    
//             }
//             if (questions[0].CorrectAns5 && questions[0].CorrectAns5 != '-') {
//                 answercorrect.push(questions[0].CorrectAns5)                                    
//             }
//             if (questions[0].CorrectAns6 && questions[0].CorrectAns6 != '-') {
//                 answercorrect.push(questions[0].CorrectAns6)                                    
//             }
//             if (questions[0].CorrectAns7 && questions[0].CorrectAns7 != '-') {
//                 answercorrect.push(questions[0].CorrectAns7)                                    
//             }
//             if (questions[0].CorrectAns8 && questions[0].CorrectAns8 != '-') {
//                 answercorrect.push(questions[0].CorrectAns8)                                    
//             }
//             if (questions[0].CorrectAns9 && questions[0].CorrectAns9 != '-') {
//                 answercorrect.push(questions[0].CorrectAns9)                                    
//             }
//             if (questions[0].CorrectAns10 && questions[0].CorrectAns10 != '-') {
//                 answercorrect.push(questions[0].CorrectAns10)                                    
//             }
//             if (questions[0].CorrectAns11 && questions[0].CorrectAns11 != '-') {
//                 answercorrect.push(questions[0].CorrectAns11)                                    
//             }
//             if (questions[0].CorrectAns12 && questions[0].CorrectAns12 != '-') {
//                 answercorrect.push(questions[0].CorrectAns12)                                    
//             }
//             if (questions[0].CorrectAns13 && questions[0].CorrectAns13 != '-') {
//                 answercorrect.push(questions[0].CorrectAns13)                                    
//             }
//             if (questions[0].CorrectAns14 && questions[0].CorrectAns14 != '-') {
//                 answercorrect.push(questions[0].CorrectAns14)                                    
//             }
//             if (questions[0].CorrectAns15 && questions[0].CorrectAns15 != '-') {
//                 answercorrect.push(questions[0].CorrectAns15)                                    
//             }
//         }else if (questions[0].type == 2) {
//             if (questions[0].CorrectAns) {
//                 answercorrect.push(questions[0].CorrectAns)                            
//                 let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns}'`
//                         // console.log(incorrectlists);
//                         sql.query(incorrectlists, (err, incorrectlist) => {
//                             answer.push(({
//                     answer: questions[0].CorrectAns,
//                     point: incorrectlist.length
//                 }))
//             });
//             }
//             if (questions[0].IncorrectAns1) {
//                 let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns1}'`
//                         // console.log(answerlists);
//                         sql.query(incorrectlists, (err, incorrectlist) => {
//                 wronganswer.push(({
//                     answer: questions[0].IncorrectAns1,
//                     point: incorrectlist.length
//                 }))
//             });
//             }
//             if (questions[0].IncorrectAns2) {
//                 let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns2}'`
//                 // console.log(answerlists);
//                 sql.query(incorrectlists, (err, incorrectlist) => {
//         wronganswer.push(({
//             answer: questions[0].IncorrectAns2,
//             point: incorrectlist.length
//         }))
//     });
//             }
//             if (questions[0].IncorrectAns3) {
//                 let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns3}'`
//                 // console.log(answerlists);
//                 sql.query(incorrectlists, (err, incorrectlist) => {
//         wronganswer.push(({
//             answer: questions[0].IncorrectAns3,
//             point: incorrectlist.length
//         }))
//     });
//             }
//             if (questions[0].IncorrectAns4) {
//                 let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns4}'`
//                 // console.log(answerlists);
//                 sql.query(incorrectlists, (err, incorrectlist) => {
//         wronganswer.push(({
//             answer: questions[0].IncorrectAns4,
//             point: incorrectlist.length
//         }))
//     });
//             }
//         }
//         console.log(questions[0].type);
//                             if (questions[0].type == 1) {
//                                 countans.forEach(function (element, i) {
//                                     // var imageans = questions[0].CorrectAns1.includes('Q')
//                                     // var imageansimg = questions[0].CorrectAns1.includes('img')
//                                     // if (imageans && !imageansimg) {
//                                     //     if (getFileName(imgfiles, questions[0].CorrectAns1)) {
//                                     //         questions[0].CorrectAns1 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns1) + '"/>'
//                                     //     }
//                                     // }

//                                     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${element.answer1}'`
//                                     // console.log(answerlists);
//                                     sql.query(answerlists, (err, answerlist) => {
//                                         if (element.score > 0) {
//                                             var same = anstext.includes(element.answer1)
//                                             if (!same) {
//                                                 answer.push({
//                                                     answer: element.answer1,
//                                                     point: answerlist.length
//                                                 })
//                                             }
//                                             anstext += element.answer1 + ' '
//                                         } else {
//                                             var samewrongtext = wrongtext.includes(element.answer1)
//                                             if (!samewrongtext) {
//                                                 wronganswer.push({
//                                                     answer: element.answer1,
//                                                     point: answerlist.length
//                                                 })
//                                             }
//                                             wrongtext += element.answer1 + ' '
//                                         }
//                                             console.log(answercorrect);                 
//                             questionslist.push({
//                                 id: res[q].id,
//                                 image: '',
//                                 question_id: res[q].question_id,
//                                 questiontype: res[q].question_set_id,
//                                 question_set_name: res[q].question_name,
//                                 no: questions[0].no,
//                                 question: questions[0].question,
//                                 weight: weightno,
//                                 notraing: countans.length,
//                                 type: res[q].type,
//                                 percent: (weightno / countans.length) * 100,
//                                 level: res[q].level,
//                                 levelnews_id: levelnew[0].id,
//                                 levelnews: levelnew[0].name,
//                                 answer: answer,
//                                 wronganswer: wronganswer,
//                                 answercorrect:answercorrect
//                             })
                            
//                             anstext = ''
//                             wrongtext = ''
//                             weightno = 0
//                             answer=[]
//                     answerlist = []
//                     wronganswer=[]
//                     answercorrect=[]
//                                     }) 
//                                 });
//                                 // console.log(answer);
//                             }
//                              if (questions[0].type == 3) {
//                                 if (questions[0].CorrectAns1 != '-') {
//                                     answerlist.push(questions[0].CorrectAns1)                                    
//                                 }
//                                 if (questions[0].CorrectAns2 != '-') {
//                                     answerlist.push(questions[0].CorrectAns2)                                    
//                                 }
//                                 if (questions[0].CorrectAns3 != '-') {
//                                     answerlist.push(questions[0].CorrectAns3)                                    
//                                 }
//                                 if (questions[0].CorrectAns4 != '-') {
//                                     answerlist.push(questions[0].CorrectAns4)                                    
//                                 }
//                                 if (questions[0].CorrectAns5 != '-') {
//                                     answerlist.push(questions[0].CorrectAns5)                                    
//                                 }
//                                 if (questions[0].CorrectAns6 != '-') {
//                                     answerlist.push(questions[0].CorrectAns6)                                    
//                                 }
//                                 if (questions[0].CorrectAns7 != '-') {
//                                     answerlist.push(questions[0].CorrectAns7)                                    
//                                 }
//                                 if (questions[0].CorrectAns8 != '-') {
//                                     answerlist.push(questions[0].CorrectAns8)                                    
//                                 }
//                                 if (questions[0].CorrectAns9 != '-') {
//                                     answerlist.push(questions[0].CorrectAns9)                                    
//                                 }
//                                 if (questions[0].CorrectAns10 != '-') {
//                                     answerlist.push(questions[0].CorrectAns10)                                    
//                                 }
//                                 if (questions[0].CorrectAns11 != '-') {
//                                     answerlist.push(questions[0].CorrectAns11)                                    
//                                 }
//                                 if (questions[0].CorrectAns12 != '-') {
//                                     answerlist.push(questions[0].CorrectAns12)                                    
//                                 }
//                                 if (questions[0].CorrectAns13 != '-') {
//                                     answerlist.push(questions[0].CorrectAns13)                                    
//                                 }
//                                 if (questions[0].CorrectAns14 != '-') {
//                                     answerlist.push(questions[0].CorrectAns14)                                    
//                                 }
//                                 if (questions[0].CorrectAns15 != '-') {
//                                     answerlist.push(questions[0].CorrectAns15)                                    
//                                 }
// // console.log(anslist);
//                                         anslist.forEach(function (ansstu, i) {

//                                     var compareans = answerlist.find(el => el === ansstu);
//                                             // var compareans = ansstu.includes(ans)
//                                             let answerdata = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${ansstu}' or answer2 = '${ansstu}' or answer3 = '${ansstu}'`
//                                             // console.log(answerdata);
//                                             sql.query(answerdata, (err, answerlist) => {
//                                                 // console.log(compareans);
//                                             if (compareans) {
//                                                 var same = anstext.includes(ansstu)
//                                                 if (!same) {
//                                                     answer.push({
//                                                         answer: ansstu,
//                                                         point: answerlist.length
//                                                     })
//                                                 anstext += ansstu + ' '
//                                                 }

//                                             } else {
//                                                 // console.log(ansstu);
//                                                 var samewrongtext = wrongtext.includes(ansstu)
//                                                 // var sametext = anstext.includes(ansstu)
//                                                 if (!samewrongtext) {
//                                                     wronganswer.push({
//                                                         answer: ansstu,
//                                                         point: answerlist.length
//                                                     })
//                                                 }
//                                                 wrongtext += ansstu + ' '
//                                             }
//                                             var ch = inArray(res[q].id,questionslist) 
//                                             console.log(ch);         
//                             questionslist.push({
//                                 id: res[q].id,
//                                 image: '',
//                                 question_id: res[q].question_id,
//                                 questiontype: res[q].question_set_id,
//                                 question_set_name: res[q].question_name,
//                                 no: questions[0].no,
//                                 question: questions[0].question,
//                                 weight: weightno,
//                                 notraing: countans.length,
//                                 type: res[q].type,
//                                 percent: (weightno / countans.length) * 100,
//                                 level: res[q].level,
//                                 levelnews_id: levelnew[0].id,
//                                 levelnews: levelnew[0].name,
//                                 answer: answer,
//                                 wronganswer: wronganswer,
//                                 answercorrect:answercorrect
//                             })
                            
//                             anstext = ''
//                             wrongtext = ''
//                             weightno = 0
//                             answer=[]
//                     answerlist = []
//                     wronganswer=[]
//                     answercorrect=[]
//                                         });
                                        
//                                         })
                                
//                             }    
//                             if (questions[0].type == 2) {
                                                      
//                             questionslist.push({
//                                 id: res[q].id,
//                                 image: '',
//                                 question_id: res[q].question_id,
//                                 questiontype: res[q].question_set_id,
//                                 question_set_name: res[q].question_name,
//                                 no: questions[0].no,
//                                 question: questions[0].question,
//                                 weight: weightno,
//                                 notraing: countans.length,
//                                 type: res[q].type,
//                                 percent: (weightno / countans.length) * 100,
//                                 level: res[q].level,
//                                 levelnews_id: levelnew[0].id,
//                                 levelnews: levelnew[0].name,
//                                 answer: answer,
//                                 wronganswer: wronganswer,
//                                 answercorrect:answercorrect
//                             })
                            
//                             anstext = ''
//                             wrongtext = ''
//                             weightno = 0
//                             answer=[]
//                     answerlist = []
//                     wronganswer=[]
//                     answercorrect=[]
//                             }
//                         });
//                     });
//                 });
//             }
//         })
//         if (err) {
//             result(null, err);
//             return;
//         }
//         setTimeout(() => {

//             // console.log(questionslist);
//             result(null, questionslist);
//         }, 1000);
//     });
};

Data.getdetailtype = (id, result) => {
    var root = path.resolve("./");
    var imgfiles = []
    var directory = root + '/uploads';
    // console.log(directory);
    const directoryPath = path.join(directory);

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            // handle error; e.g., folder didn't exist 
        }
        // console.log(files);
        imgfiles = files
    });
    // let query = "SELECT * FROM `random` where question_set_id = 6 and status = true order by id LIMIT 5";
    let query = `SELECT r.type,r.id,r.weight,q.question_name,r.question_set_id,r.question_id,(select l.name from level l where r.level = l.id) as level,(select COUNT(atr.id) from answer_training atr where r.question_id = atr.question_id and r.question_set_id = atr.question_set_id and atr.round is null) as notraing FROM random r join question_set q on q.id = r.question_set_id where r.id = ${id}`;
    sql.query(query, (err, res) => {
        var questionslist = []
        var answercorrect = []

        var answerlist = []
        var anslist = []
        var answer = []
        var wronganswer = []
        var weightno = 0
        // console.log(res);
        let manage_training = `SELECT * FROM manage_training`;
        sql.query(manage_training, (err, train) => {
            // console.log(train[0].weight);
            category = '['
            data = '['
            for (let q = 0; q < res.length; q++) {
                // console.log(res[q].type)
                if (res[q].type == 1 || res[q].type == 3) {
                    question = `SELECT * FROM question_subjecttest s where s.id = ${res[q].question_id}`;
                } else if (res[q].type == 2) {
                    question = `SELECT * FROM question_objectivetest s where s.id = ${res[q].question_id}`;
                }
                sql.query(question, (err, questions) => {
                    // console.log(questions[0]);
                    var imagepath = ''
                    var imagefile = questions[0].question.includes("(Q")
                    var quesimg = ''
                        // console.log(imagefile);
                        if (imagefile) {
                            // console.log(questions[0].questions);
                            var ques = questions[0].question.split("(Q")
                            ques = ques[1].split(")")
                            // questions[0].question = ques[1]
                            quesimg = 'Q' + ques[0]
                            quesimg = quesimg.split(")")[0]
                            // console.log(quesimg);       
                        }
                        // console.log(imagefile);
                        if (quesimg && imagefile) {
                            // console.log(questions[0].question);
                            var im = '<br/>'+ '<img style="width:40%" src="' +  dbConfig.link + getFileName(imgfiles, quesimg) + '"/>'+'<br/>'
                        quesimg = '('+quesimg+')'
                        // console.log(im);
                        imagepath = questions[0].question.replace(quesimg, im);

                            // imagepath = element.question + '<br/>'+ '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, quesimg) + '"/>'
                        }else{
                            imagepath = questions[0].question
                        }
                    if (res[q].type == 1 || res[q].type == 3) {  
                        if (questions[0].CorrectAns1 && questions[0].CorrectAns1 != '-') {
                            answercorrect.push(questions[0].CorrectAns1)                                    
                        }
                        if (questions[0].CorrectAns2 && questions[0].CorrectAns2 != '-') {
                            answercorrect.push(questions[0].CorrectAns2)                                    
                        }
                        if (questions[0].CorrectAns3 && questions[0].CorrectAns3 != '-') {
                            answercorrect.push(questions[0].CorrectAns3)                                    
                        }
                        if (questions[0].CorrectAns4 && questions[0].CorrectAns4 != '-') {
                            answercorrect.push(questions[0].CorrectAns4)                                    
                        }
                        if (questions[0].CorrectAns5 && questions[0].CorrectAns5 != '-') {
                            answercorrect.push(questions[0].CorrectAns5)                                    
                        }
                        if (questions[0].CorrectAns6 && questions[0].CorrectAns6 != '-') {
                            answercorrect.push(questions[0].CorrectAns6)                                    
                        }
                        if (questions[0].CorrectAns7 && questions[0].CorrectAns7 != '-') {
                            answercorrect.push(questions[0].CorrectAns7)                                    
                        }
                        if (questions[0].CorrectAns8 && questions[0].CorrectAns8 != '-') {
                            answercorrect.push(questions[0].CorrectAns8)                                    
                        }
                        if (questions[0].CorrectAns9 && questions[0].CorrectAns9 != '-') {
                            answercorrect.push(questions[0].CorrectAns9)                                    
                        }
                        if (questions[0].CorrectAns10 && questions[0].CorrectAns10 != '-') {
                            answercorrect.push(questions[0].CorrectAns10)                                    
                        }
                        if (questions[0].CorrectAns11 && questions[0].CorrectAns11 != '-') {
                            answercorrect.push(questions[0].CorrectAns11)                                    
                        }
                        if (questions[0].CorrectAns12 && questions[0].CorrectAns12 != '-') {
                            answercorrect.push(questions[0].CorrectAns12)                                    
                        }
                        if (questions[0].CorrectAns13 && questions[0].CorrectAns13 != '-') {
                            answercorrect.push(questions[0].CorrectAns13)                                    
                        }
                        if (questions[0].CorrectAns14 && questions[0].CorrectAns14 != '-') {
                            answercorrect.push(questions[0].CorrectAns14)                                    
                        }
                        if (questions[0].CorrectAns15 && questions[0].CorrectAns15 != '-') {
                            answercorrect.push(questions[0].CorrectAns15)                                    
                        }
                    }else if (res[q].type == 2) {
                        if (questions[0].CorrectAns) {
                            answercorrect.push(questions[0].CorrectAns)                            
                            let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns}'`
                                    // console.log(incorrectlists);
                                    sql.query(incorrectlists, (err, incorrectlist) => {
                                        answer.push(({
                                answer: questions[0].CorrectAns,
                                point: incorrectlist.length
                            }))
                        });
                        }
                        if (questions[0].IncorrectAns1) {
                            let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns1}'`
                                    // console.log(answerlists);
                                    sql.query(incorrectlists, (err, incorrectlist) => {
                            wronganswer.push(({
                                answer: questions[0].IncorrectAns1,
                                point: incorrectlist.length
                            }))
                        });
                        }
                        if (questions[0].IncorrectAns2) {
                            let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns2}'`
                            // console.log(answerlists);
                            sql.query(incorrectlists, (err, incorrectlist) => {
                    wronganswer.push(({
                        answer: questions[0].IncorrectAns2,
                        point: incorrectlist.length
                    }))
                });
                        }
                        if (questions[0].IncorrectAns3) {
                            let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns3}'`
                            // console.log(answerlists);
                            sql.query(incorrectlists, (err, incorrectlist) => {
                    wronganswer.push(({
                        answer: questions[0].IncorrectAns3,
                        point: incorrectlist.length
                    }))
                });
                        }
                        if (questions[0].IncorrectAns4) {
                            let incorrectlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].IncorrectAns4}'`
                            // console.log(answerlists);
                            sql.query(incorrectlists, (err, incorrectlist) => {
                    wronganswer.push(({
                        answer: questions[0].IncorrectAns4,
                        point: incorrectlist.length
                    }))
                });
                        }
                    }
                    let ans = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id}`
                    sql.query(ans, (err, countans) => {
                        countans.forEach(function (element, i) {
                            weightno = weightno + element.score

                            if (element.answer1) {
                                anslist.push(element.answer1)
                            }
                            if (element.answer2) {
                                anslist.push(element.answer2)
                            }
                            if (element.answer3) {
                                anslist.push(element.answer3)
                            }
                        });
                        var per = (res[q].weight / res[q].notraing) * 100
                        var perlevel = per / 100
                        let levelnews = ''
                        console.log(perlevel);
                        if (perlevel && perlevel != Infinity) {
                            levelnews = `SELECT l.name,l.id FROM level l where ${perlevel} BETWEEN l.percent_from AND l.percent_to`;
                        } else {
                            levelnews = `SELECT l.name,l.id FROM level l where l.id = 1`;
                        }
                        // console.log(per,perlevel);
                        sql.query(levelnews, (err, levelnew) => {
        var wrongtext = ''
        var anstext = ''
                            if (questions[0].type == 1) {
                                var anstext = ''
                                var wrongtext = ''
                                countans.forEach(function (element, i) {
                                    // var imageans = questions[0].CorrectAns1.includes('Q')
                                    // var imageansimg = questions[0].CorrectAns1.includes('img')
                                    // if (imageans && !imageansimg) {
                                    //     if (getFileName(imgfiles, questions[0].CorrectAns1)) {
                                    //         questions[0].CorrectAns1 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns1) + '"/>'
                                    //     }
                                    // }

                                    let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${element.answer1}'`
                                    // console.log(answerlists);
                                    sql.query(answerlists, (err, answerlist) => {
                                        if (element.score > 0) {
                                            var same = anstext.includes(element.answer1)
                                            if (!same) {
                                                answer.push({
                                                    answer: element.answer1,
                                                    point: answerlist.length
                                                })
                                            }
                                            anstext += element.answer1 + ' '
                                        } else {
                                            var samewrongtext = wrongtext.includes(element.answer1)
                                            if (!samewrongtext) {
                                                wronganswer.push({
                                                    answer: element.answer1,
                                                    point: answerlist.length
                                                })
                                            }
                                            wrongtext += element.answer1 + ' '
                                        }
                                    })

                                    // }
                                    // else{
                                    //     var anstext = ''
                                    //         let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${element.answer1}'`    
                                    //     // console.log(answerlists);
                                    //     sql.query(answerlists, (err, answerlist) => {
                                    //     wronganswer.push({
                                    //         answer:element.answer1,
                                    //         point:answerlist.length
                                    //     })
                                    // }) 
                                    // }
                                    // anstext += element.answer1 + ' '  
                                });
                                // if (questions[0].CorrectAns1 && questions[0].CorrectAns1 != '-') {
                                //     var imageans = questions[0].CorrectAns1.includes('Q')
                                //     var imageansimg = questions[0].CorrectAns1.includes('img')
                                //     if (imageans && !imageansimg) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns1)) {
                                //             questions[0].CorrectAns1 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns1) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns1}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns1,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns2 && questions[0].CorrectAns2 != '-') {
                                //     var imageans1 = questions[0].CorrectAns2.includes('Q')
                                //     var imageans1img = questions[0].CorrectAns2.includes('img')
                                //     if (imageans1 && !imageans1img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns2)) {
                                //             questions[0].CorrectAns2 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns2) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns2}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns2,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns3 && questions[0].CorrectAns3 != '-') {
                                //     var imageans2 = questions[0].CorrectAns3.includes('Q')
                                //     var imageans2img = questions[0].CorrectAns3.includes('img')
                                //     if (questions[0].CorrectAns3 && imageans2 && !imageans2img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns3)) {
                                //             questions[0].CorrectAns3 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns3) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns3}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns3,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns4 && questions[0].CorrectAns4 != '-') {
                                //     var imageans3 = questions[0].CorrectAns4.includes('Q')
                                //     var imageans3img = questions[0].CorrectAns4.includes('img')
                                //     if (questions[0].CorrectAns4 && imageans3 && !imageans3img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns4)) {
                                //             questions[0].CorrectAns4 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns4) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns4}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns4,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns5 && questions[0].CorrectAns5 != '-') {
                                //     var imageans4 = questions[0].CorrectAns5.includes('Q')
                                //     var imageans4img = questions[0].CorrectAns5.includes('img')
                                //     if (imageans4 && !imageans4img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns5)) {
                                //             questions[0].CorrectAns5 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns5) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns5}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns5,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns6 && questions[0].CorrectAns6 != '-') {
                                //     var imageans5 = questions[0].CorrectAns6.includes('Q')
                                //     var imageans5img = questions[0].CorrectAns6.includes('img')
                                //     if (imageans5 && !imageans5img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns6)) {
                                //             questions[0].CorrectAns6 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns6) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns6}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns6,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns7 && questions[0].CorrectAns7 != '-') {
                                //     var imageans6 = questions[0].CorrectAns7.includes('Q')
                                //     var imageans6img = questions[0].CorrectAns7.includes('img')
                                //     if (imageans6 && !imageans6img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns7)) {
                                //             questions[0].CorrectAns7 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns7) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns7}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns7,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns8 && questions[0].CorrectAns8 != '-') {
                                //     var imageans7 = questions[0].CorrectAns8.includes('Q')
                                //     var imageans7img = questions[0].CorrectAns8.includes('img')
                                //     if (imageans7 && !imageans7img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns8)) {
                                //             questions[0].CorrectAns8 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns8) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns8}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns8,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns9 && questions[0].CorrectAns9 != '-') {
                                //     var imageans8 = questions[0].CorrectAns9.includes('Q')
                                //     var imageans8img = questions[0].CorrectAns9.includes('img')
                                //     if (imageans8 && !imageans8img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns9)) {
                                //             questions[0].CorrectAns9 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns9) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns9}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns9,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns10 && questions[0].CorrectAns10 != '-') {
                                //     var imageans9 = questions[0].CorrectAns10.includes('Q')
                                //     var imageans9img = questions[0].CorrectAns10.includes('img')
                                //     if (imageans9 && !imageans9img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns10)) {
                                //             questions[0].CorrectAns10 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns10) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns10}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns10,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns11 && questions[0].CorrectAns11 != '-') {
                                //     var imageans10 = questions[0].CorrectAns11.includes('Q')
                                //     var imageans10img = questions[0].CorrectAns11.includes('img')
                                //     if (imageans10 && !imageans10img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns11)) {
                                //             questions[0].CorrectAns11 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns11) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns11}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns11,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns12 && questions[0].CorrectAns12 != '-') {
                                //     var imageans11 = questions[0].CorrectAns12.includes('Q')
                                //     var imageans11img = questions[0].CorrectAns12.includes('img')
                                //     if (imageans11 && !imageans11img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns12)) {
                                //             questions[0].CorrectAns12 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns12) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns12}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns12,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns13 && questions[0].CorrectAns13 != '-') {
                                //     var imageans12 = questions[0].CorrectAns13.includes('Q')
                                //     var imageans12img = questions[0].CorrectAns13.includes('img')
                                //     if (imageans12 && !imageans12img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns13)) {
                                //             questions[0].CorrectAns13 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns13) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns13}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns13,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns14 && questions[0].CorrectAns14 != '-') {
                                //     var imageans13 = questions[0].CorrectAns14.includes('Q')
                                //     var imageans13img = questions[0].CorrectAns14.includes('img')
                                //     if (imageans13 && !imageans13img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns14)) {
                                //             questions[0].CorrectAns14 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns14) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns14}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns14,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                                // if (questions[0].CorrectAns15 && questions[0].CorrectAns15 != '-') {
                                //     var imageans14 = questions[0].CorrectAns15.includes('Q')
                                //     var imageans14img = questions[0].CorrectAns15.includes('img')
                                //     if (imageans14 && !imageans14img) {
                                //         if (getFileName(imgfiles, questions[0].CorrectAns15)) {
                                //             questions[0].CorrectAns15 = '<img style="width:100%" src="' +  dbConfig.link + getFileName(imgfiles, questions[0].CorrectAns15) + '"/>'
                                //         }
                                //     }
                                //     let answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${questions[0].CorrectAns15}'`    
                                //     // console.log(answerlists);
                                //     sql.query(answerlists, (err, answerlist) => {
                                //     answer.push({
                                //         answer:questions[0].CorrectAns15,
                                //         point:answerlist.length
                                //     })
                                // })
                                // }
                            } if (questions[0].type == 3) {
                                if (questions[0].CorrectAns1 != '-') {
                                    answerlist.push(questions[0].CorrectAns1)                                    
                                }
                                if (questions[0].CorrectAns2 != '-') {
                                    answerlist.push(questions[0].CorrectAns2)                                    
                                }
                                if (questions[0].CorrectAns3 != '-') {
                                    answerlist.push(questions[0].CorrectAns3)                                    
                                }
                                if (questions[0].CorrectAns4 != '-') {
                                    answerlist.push(questions[0].CorrectAns4)                                    
                                }
                                if (questions[0].CorrectAns5 != '-') {
                                    answerlist.push(questions[0].CorrectAns5)                                    
                                }
                                if (questions[0].CorrectAns6 != '-') {
                                    answerlist.push(questions[0].CorrectAns6)                                    
                                }
                                if (questions[0].CorrectAns7 != '-') {
                                    answerlist.push(questions[0].CorrectAns7)                                    
                                }
                                if (questions[0].CorrectAns8 != '-') {
                                    answerlist.push(questions[0].CorrectAns8)                                    
                                }
                                if (questions[0].CorrectAns9 != '-') {
                                    answerlist.push(questions[0].CorrectAns9)                                    
                                }
                                if (questions[0].CorrectAns10 != '-') {
                                    answerlist.push(questions[0].CorrectAns10)                                    
                                }
                                if (questions[0].CorrectAns11 != '-') {
                                    answerlist.push(questions[0].CorrectAns11)                                    
                                }
                                if (questions[0].CorrectAns12 != '-') {
                                    answerlist.push(questions[0].CorrectAns12)                                    
                                }
                                if (questions[0].CorrectAns13 != '-') {
                                    answerlist.push(questions[0].CorrectAns13)                                    
                                }
                                if (questions[0].CorrectAns14 != '-') {
                                    answerlist.push(questions[0].CorrectAns14)                                    
                                }
                                if (questions[0].CorrectAns15 != '-') {
                                    answerlist.push(questions[0].CorrectAns15)                                    
                                }
// console.log(anslist);
                                        anslist.forEach(function (ansstu, i) {

                                    var compareans = answerlist.find(el => el === ansstu);
                                            // var compareans = ansstu.includes(ans)
                                            let answerdata = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and answer1 = '${ansstu}' or answer2 = '${ansstu}' or answer3 = '${ansstu}'`
                                            // console.log(answerdata);
                                            sql.query(answerdata, (err, answerlist) => {
                                                // console.log(compareans);
                                            if (compareans) {
                                                var same = anstext.includes(ansstu)
                                                if (!same) {
                                                    answer.push({
                                                        answer: ansstu,
                                                        point: answerlist.length
                                                    })
                                                anstext += ansstu + ' '
                                                }

                                            } else {
                                                // console.log(ansstu);
                                                var samewrongtext = wrongtext.includes(ansstu)
                                                // var sametext = anstext.includes(ansstu)
                                                if (!samewrongtext) {
                                                    wronganswer.push({
                                                        answer: ansstu,
                                                        point: answerlist.length
                                                    })
                                                }
                                                wrongtext += ansstu + ' '
                                            }
                                        });
                                        })
                                    
                                    // for (let e = 0; e < questions[0].no; e++) {
                                    //     // console.log(e + 1);
                                    //     var ans = 'answer'
                                    //     ans += e + 1
                                    //     let answerlists
                                    //     if (e + 1 == 1) {
                                    //         answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and ${ans} = '${element.answer1}'`
                                    //     } else if (e + 1 == 2) {
                                    //         answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and ${ans} = '${element.answer2}'`

                                    //     } else if (e + 1 == 3) {
                                    //         answerlists = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id} and ${ans} = '${element.answer3}'`
                                    //     }
                                    //     // console.log(answerlists);
                                    //     sql.query(answerlists, (err, answerlist) => {
                                    //         // console.log(answerlist);
                                    //         if (element.score > 0) {
                                    //             console.log(e + 1);
                                    //             var same = ''
                                    //             if (e + 1 == 1) {
                                    //                 same = anstext.includes(element.answer1)
                                    //             } else if (e + 1 == 2) {
                                    //                 same = anstext.includes(element.answer2)        
                                    //             } else if (e + 1 == 3) {
                                    //                 same = anstext.includes(element.answer3)
                                    //             }
                                    //             if (!same) {
                                    //                 if (e + 1 == 1) {                                                        
                                    //                     answer.push({
                                    //                         answer: element.answer1,
                                    //                         point: answerlist.length
                                    //                     })
                                    //                 } else if (e + 1 == 2) {
                                    //                     answer.push({
                                    //                         answer: element.answer2,
                                    //                         point: answerlist.length
                                    //                     })

                                    //                 } else if (e + 1 == 3) {
                                    //                     answer.push({
                                    //                         answer: element.answer3,
                                    //                         point: answerlist.length
                                    //                     })
                                    //                 }

                                    //             }
                                    //             anstext += element.answer1 + ' ' +element.answer2 + ' '+element.answer3 + ' '
                                    //         } else {
                                    //             var samewrongtext = ''
                                    //             if (e + 1 == 1) {
                                    //                 samewrongtext = anstext.includes(element.answer1)
                                    //             } else if (e + 1 == 2) {
                                    //                 samewrongtext = anstext.includes(element.answer2)        
                                    //             } else if (e + 1 == 3) {
                                    //                 samewrongtext = anstext.includes(element.answer3)
                                    //             }
                                    //             if (!samewrongtext) {
                                    //                 if (e + 1 == 1) {                                                        
                                    //                     wronganswer.push({
                                    //                         answer: element.answer1,
                                    //                         point: answerlist.length
                                    //                     })
                                    //                 } else if (e + 1 == 2) {
                                    //                     wronganswer.push({
                                    //                         answer: element.answer2,
                                    //                         point: answerlist.length
                                    //                     })

                                    //                 } else if (e + 1 == 3) {
                                    //                     wronganswer.push({
                                    //                         answer: element.answer3,
                                    //                         point: answerlist.length
                                    //                     })
                                    //                 }

                                    //             }
                                    //             wrongtext += element.answer1 + ' ' +element.answer2 + ' '+element.answer3 + ' '
                                    //         }
                                    //     })
                                    // }
                                
                            }
                            questionslist.push({
                                id: res[q].id, 
                                image: '',
                                // question: question[qu].image,
                                question_id: res[q].question_id,
                                questiontype: res[q].question_set_id,
                                question_set_name: res[q].question_name,
                                no: questions[0].no,
                                question: imagepath,
                                weight: weightno,
                                notraing: countans.length,
                                type: res[q].type,
                                percent: (weightno / countans.length) * 100,
                                level: res[q].level,
                                levelnews_id: levelnew[0].id,
                                levelnews: levelnew[0].name,
                                answer: answer,
                                wronganswer: wronganswer,
                                answercorrect:answercorrect
                            })
                        });
                    });
                });
            }
        })
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {

            // console.log(questionslist);
            result(null, questionslist);
        }, 1000);
    });
};

Data.gettypethree = (name, result) => {
    // let query = "SELECT * FROM `random` where question_set_id = 6 and status = true order by id LIMIT 5";
    let query = `SELECT r.type,r.id,r.weight,q.question_name,r.question_set_id,r.question_id,(select l.name from level l where r.level = l.id) as level,(select COUNT(atr.id) from answer_training atr where r.question_id = atr.question_id and r.question_set_id = atr.question_set_id and atr.round is null) as notraing FROM answer_training atr join random r on atr.question_id = r.question_id and atr.question_set_id = r.question_set_id join question_set q on q.id = r.question_set_id where r.status = true and r.type = 3 and atr.round is null GROUP BY r.id order by r.id;`;
    sql.query(query, (err, res) => {
        var questionslist = []
        // console.log(res);
        let manage_training = `SELECT * FROM manage_training`;
        sql.query(manage_training, (err, train) => {
            // console.log(train[0].weight);
            category = '['
            data = '['
            for (let q = 0; q < res.length; q++) {
                // console.log(train[0].no_train , res[q].notraing)
                    if (res[0].type == 1 || res[0].type == 3) {
                        question = `SELECT * FROM question_subjecttest s where s.id = ${res[q].question_id}`;
                    } else if (res[0].type == 2) {
                        question = `SELECT * FROM question_objectivetest s where s.id = ${res[q].question_id}`;
                    }
                    sql.query(question, (err, questions) => {
                        let ans = `SELECT * FROM answer_training WHERE question_id = ${res[q].question_id} and question_set_id = ${res[q].question_set_id}`
                        sql.query(ans, (err, countans) => {
                            questionslist.push({
                                id: res[q].id,
                                categories: 'ข้อ ' + res[q].id,
                                data: countans.length
                                // data: (countans.length / train[0].no_train) * 100
                            })
                        });
                    });
            }
        })
        // console.log(question);
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {
            result(null, questionslist);
        }, 1000);
    });
};

Data.gettypetwo = (name, result) => {
    let query = `SELECT * from products s where s.statusdelete = true and statusfda = false`;
    sql.query(query, (err, res) => {
    var question =''
        var questionslist = []
            for (let q = 0; q < 7; q++) {
                if (q == 0) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = false and s.is_cat = true and s.is_name = true);`;
                }else if (q == 1) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = true and s.is_cat = false and s.is_name = true);`;
                }else if (q == 2) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = true and s.is_cat = true and s.is_name = false);`;
                }else if (q == 3) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = false and s.is_cat = false and s.is_name = true)`;
                }else if (q == 4) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = false and s.is_cat = true and s.is_name = false)`;
                }else if (q == 5) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = true and s.is_cat = false and s.is_name = false)`;
                }
                else if (q == 6) {
                    question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = false and s.is_cat = false and s.is_name = false)`;
                }
                console.log(question);
                    sql.query(question, (err, questions) => {
                        var name=''
                        var id=''
                        var color=''
                        if (q == 0) {
                            name = 'เลขที่อนุญาต ' + questions.length + ' รายการ'
                            id=1
                            // color='#00E396'

                        }else if (q == 1) {
                            name = 'ประเภทผลิตภัณฑ์	 ' + questions.length + ' รายการ'
                            id=2
                            // color='#FE2600'
                        }else if (q == 2) {
                            name = 'ชื่อผลิตภัณฑ์ ' + questions.length + ' รายการ'
                            id=3
                            // color='#FEC600'
                        }else if (q == 3) {
                            name = 'เลขที่อนุญาตและประเภทผลิตภัณฑ์ ' + questions.length + ' รายการ'
                            id=4
                            // color='#FEC600'
                        }else if (q == 4) {
                            name = 'เลขที่อนุญาตและชื่อผลิตภัณฑ์ ' + questions.length + ' รายการ'
                            id=5
                            // color='#FEC600'
                        }else if (q == 5) {
                            name = 'ประเภทผลิตภัณฑ์และชื่อผลิตภัณฑ์ ' + questions.length + ' รายการ'
                            id=6
                            // color='#FEC600'
                        }
                        else if (q == 6) {
                            name = 'ทั้ง 3 เงื่อนไข ' + questions.length + ' รายการ'
                            id=7
                            // color='#FEC600'
                        }
                            questionslist.push({
                                id: id,
                                categories: name,
                                data: questions.length,
                                color:color
                            })
                  
                        });
                
                
            }
            
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {
            result(null, questionslist);
        }, 1000);
    });

};

// Data.gettypetwo = (status, result) => {
//     var list = []
//     let query = `SELECT * from products`;
//     sql.query(query, (err, res) => {
//         var count1=0
//         var count2=0
//         var count3=0
//         var list1 = []
//         var list2 = []
//         var list3 = []
//             for (let q = 0; q < res.length; q++) {
//                 if (res[q].is_fda == 1 && res[q].is_cat == 1 && res[q].is_name == 1) {
//                     count1 = count1+1
//                     list1.push(res[q])
//                 }else if(res[q].is_fda == null && res[q].is_cat == null && res[q].is_name == null){
//                     count3 = count3+1
//                     list3.push(res[q])
//                 }else{
//                     count2 = count2+1
//                     list2.push(res[q])
//                 }
//             }
//             var counttype1 = 0
//             var counttype2 = 0
//             var counttype3 = 0
//             var counttype4 = 0
//             var counttype5 = 0
//             var counttype6 = 0
//             console.log(list2.length);
//         for (let r = 0; r < list2.length; r++) {
//             console.log(list2[r].id);
//             if (list2[r].is_fda == 0 && list2[r].is_cat == 1 && res[r].is_name == 1) {
//                 counttype1 = counttype1+1
//             }else if (list2[r].is_fda == 1 && list2[r].is_cat == 0 && res[r].is_name == 1) {
//                 counttype2 = counttype2+1
//             }else if (list2[r].is_fda == 1 && list2[r].is_cat ==1 && res[r].is_name == 0) {
//                 counttype3 = counttype3+1
//             }else if (list2[r].is_fda == 1 && list2[r].is_cat == 1 && res[r].is_name == 0) {
//                 counttype4 = counttype4+1
//             }else if (list2[r].is_fda == 1 && list2[r].is_cat == 0 && res[r].is_name == 1) {
//                 counttype5 = counttype5+1
//             }else if (list2[r].is_fda == 0 && list2[r].is_cat == 1 && res[r].is_name == 1) {
//                 counttype6 = counttype6+1
//             }else{
//                 counttype6 = counttype6+1
//             }
//         }

//         console.log(counttype1);
//         console.log(counttype2);
//         console.log(counttype3);
//         console.log(counttype4);
//         console.log(counttype5);
//         console.log(counttype6);
//         for (let q = 0; q < 6; q++) {
//             if (q == 0) {
//                 list.push({
//                     id: 1,
//                     categories: 'เลขที่อนุญาต ' + counttype1 + ' รายการ',
//                     data: counttype1,
//                 })
//                                         }else if (q == 1) {
//                                             list.push({
//                                                 id: 2,
//                                                 categories: 'ประเภทผลิตภัณฑ์ ' + counttype2 + ' รายการ',
//                                                 data: counttype2,
//                                             })
//                                         }else if (q == 2) {
//                                             list.push({
//                                                 id: 2,
//                                                 categories: 'ชื่อผลิตภัณฑ์ ' + counttype3 + ' รายการ',
//                                                 data: counttype3,
//                                             })
//                                         }else if (q == 3) {
//                                             list.push({
//                                                 id: 2,
//                                                 categories: 'เลขที่อนุญาตและประเภทผลิตภัณฑ์ ' + counttype4 + ' รายการ',
//                                                 data: counttype3,
//                                             })
//                                         }else if (q == 4) {
//                                             list.push({
//                                                 id: 2,
//                                                 categories: 'เลขที่อนุญาตและชื่อผลิตภัณฑ์ ' + counttype5 + ' รายการ',
//                                                 data: counttype5,
//                                             })
//                                         }else if (q == 5) {
//                                             list.push({
//                                                 id: 2,
//                                                 categories: 'ประเภทผลิตภัณฑ์และชื่อผลิตภัณฑ์ ' + counttype6 + ' รายการ',
//                                                 data: counttype5,
//                                             })
//                                         }
            
//         }
//         if (err) {
//             result(null, err);
//             return;
//         }
//         setTimeout(() => {
//             result(null, list);
//         }, 500);
//     });
// };

Data.gettypeone = (name, result) => {
    // let query = "SELECT * FROM `random` where question_set_id = 6 and status = true order by id LIMIT 5";
    let query = `SELECT * from products`;
    sql.query(query, (err, res) => {
        var questionslist = []
        var count1=0
        var count2=0
        var count3=0
            for (let q = 0; q < res.length; q++) {
                if (res[q].is_fda == 1 && res[q].is_cat == 1 && res[q].is_name == 1) {
                    count1 = count1+1
                }else if(res[q].is_fda == null && res[q].is_cat == null && res[q].is_name == null){
                    count3 = count3+1
                }else{
                    count2 = count2+1
                }
            }
                questionslist.push({
                    id: 1,
                    categories: 'ผ่านการตรวจสอบตามเงื่อนไข',
                    data: count1,
                    color:'#00E396'
                },
                {
                    id: 2,
                    categories: 'ไม่ผ่านการตรวจสอบตามเงื่อนไข',
                    data: count2,
                    color:'#FE2600'
                },
                {
                    id: 3,
                    categories: 'ไม่มีหมายเลขอย.',
                    data: count3,
                    color:'#FEC600'
                })
            // for (let q = 0; q < 3; q++) {
            //     if (q == 0) {
            //         question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = false and s.is_cat = true and s.is_name = true);`;
            //     }else if (q == 1) {
            //         question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = true and s.is_cat = false and s.is_name = true);`;
            //     }else if (q == 2) {
            //         question = `SELECT * FROM products s where s.statusdelete = true and s.statusfda = false and (s.is_fda = true and s.is_cat = true and s.is_name = false);`;
            //     }
            //         sql.query(question, (err, questions) => {
            //             var name=''
            //             var id=''
            //             var color=''
            //             if (q == 0) {
            //                 name = 'ผ่านการตรวจสอบ ' + questions.length + ' รายการ'
            //                 id=res[q].statusfda
            //                 color='#00E396'

            //             }else if (q == 1) {
            //                 name = 'ไม่ผ่านการตรวจสอบ ' + questions.length + ' รายการ'
            //                 id=res[q].statusfda
            //                 color='#FE2600'
            //             }else{
            //                 name = 'ไม่มีหมายเลขอย. ' + questions.length + ' รายการ'
            //                 id=3
            //                 color='#FEC600'
            //             }
            //             // else{
            //             //     name = 'ไม่ได้ตรวจสอบ'
            //             // }
            //                 questionslist.push({
            //                     id: id,
            //                     categories: name,
            //                     data: questions.length,
            //                     color:color
            //                     // data: (countans.length / train[0].no_train) * 100
            //                 })
            //         });
                
                
            // }
        // console.log(question);
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {
            result(null, questionslist);
        }, 1000);
    });
};

Data.getAll = (name, result) => {
    // let query = "SELECT * FROM `random` where question_set_id = 6 and status = true order by id LIMIT 5";
    let query = `SELECT r.type,r.id,r.weight,ant.question,r.question_set_id,r.question_id,(select l.name from level l where r.level = l.id) as level,(select COUNT(atr.id) from answer_training atr where r.question_id = atr.question_id and r.question_set_id = atr.question_set_id and atr.round is null) as notraing FROM random r join answer_training ant on ant.random_id = r.id where r.status = true GROUP BY r.id order by r.id;`;
    sql.query(query, (err, res) => {
        var questionslist = []
        var categorylist = []
        var datalist = []
        // console.log(res);
        let manage_training = `SELECT * FROM manage_training`;
        sql.query(manage_training, (err, train) => {
            // console.log(train[0].no_train);
            for (let q = 0; q < res.length; q++) {
                if ( res[q].weight == train[0].no_train) {
                    // console.log(res[q].id);
                    // if (res[0].type == 1 || res[0].type == 3) {
                    //     question = `SELECT * FROM question_subjecttest s where s.id = ${res[q].question_id}`;
                    // } else if (res[0].type == 2) {
                    //     question = `SELECT * FROM question_objectivetest s where s.id = ${res[q].question_id}`;
                    // }
                    let questions = `SELECT * FROM answer_training s where s.random_id = ${res[q].id} and s.score > 0 and s.round is null`;
                    // console.log(questions);
                    sql.query(questions, (err, question) => {
                        var per = (question.length / res[q].notraing) * 100
                        var perlevel = per / 100
                        // console.log(per);
                        // console.log(perlevel);
                        let levelnews = `SELECT l.name,l.id FROM level l where ${perlevel} BETWEEN l.percent_from AND l.percent_to`;
                        // console.log(levelnews);
                        sql.query(levelnews, (err, levelnew) => {
                            // console.log(levelnew);
                            if (res[q].level != levelnew[0].name) {
                                let ans = `SELECT * FROM answer_training s where s.random_id = ${res[q].id} and s.round is null`;
                                sql.query(ans, (err, countans) => {
                                questionslist.push({
                                    id: res[q].id,
                                    categories: 'ข้อ ' + res[q].id,
                                    data: countans.length
                                })
                            })
                            }
                        });
                    });
                }
            }
        })
        // console.log(question);
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {
            result(null, questionslist);
        }, 1000);
    });
};
Data.findById = (id, result) => {
    let query = `SELECT r.type,r.id,r.weight,q.question_name,r.question_set_id,r.question_id,(select l.name from level l where r.level = l.id) as level,(select COUNT(atr.id) from answer_training atr where r.question_id = atr.question_id and r.question_set_id = atr.question_set_id and atr.round is null) as notraing FROM random r join question_set q on q.id = r.question_set_id where r.id = ${id}`;
    sql.query(query, (err, res) => {
        questionslist = []
        ans = []
        reals = []
        anslist = []
        question = ''
        answerlist = ''
        real = ''
        // console.log(res);
        let manage_training = `SELECT * FROM manage_training`;
        sql.query(manage_training, (err, train) => {
            // console.log(train[0].weight);
            for (let q = 0; q < res.length; q++) {
                    let questions = `SELECT * FROM answer_training s where s.random_id = ${res[q].id} and s.score > 0 and s.round is null`;
                    // console.log(questions);
                    sql.query(questions, (err, question) => {
                        var per = (question.length / res[q].notraing) * 100
                        var perlevel = per / 100
                        let levelnews = `SELECT l.name,l.id FROM level l where ${perlevel} BETWEEN l.percent_from AND l.percent_to`;
                        // console.log(res[q]);
                        if (res[q].type == 1 || res[q].type == 3) {
                            questionnames = `SELECT * FROM question_subjecttest s where s.id = ${res[q].question_id} and s.question_set_id = ${res[q].question_set_id}`;
                        } else if (res[q].type == 2) {
                            questionnames = `SELECT * FROM question_objectivetest s where s.id = ${res[q].question_id} and s.question_set_id = ${res[q].question_set_id}`;
                        }
                        // console.log(questionnames);
                        sql.query(questionnames, (err, questionname) => {
                            // console.log(questionname[0]);
                            var ques = questionname[0].question
                        sql.query(levelnews, (err, levelnew) => {
                            // console.log(ques);
                            if (res[q].level != levelnew[0].name) {
                                questionslist.push({
                                    id: res[q].id,
                                    image: '',
                                    question: ques,
                                    question_id: res[q].question_id,
                                    questiontype: res[q].question_set_id,
                                    question_set_name: res[q].question_name,
                                    no: questions[0].no,
                                    weight: question.length,
                                    notraing: res[q].notraing,
                                    level: res[q].level,
                                    percent: per,
                                    levelnews_id: levelnew[0].id,
                                    levelnews: levelnew[0].name,
                                    type: res[q].type,
                                })
                            }
                        });
                        });
                    });
            }
        })
        // console.log(question);
        if (err) {
            result(null, err);
            return;
        }
        setTimeout(() => {
console.log(questionslist);
            result(null, questionslist);
        }, 1000);
    });
};

Data.updateById = (id, datas, result) => {
    sql.query(
        "UPDATE dashboard SET name = ? WHERE id = ?",
        [datas.name, id], (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }; result(null, { id: id, ...datas });
        }
    );
};
Data.remove = (id, result) => {
    sql.query(
        "DELETE FROM dashboard  WHERE id = ?", id, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }
            if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
            }
            result(null, res);
        });
};

Data.removeAll = result => {
    sql.query("DELETE FROM dashboard", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        result(null, res);
    });
};

module.exports = Data;