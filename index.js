//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_ta',
  multipleStatements: true
});


//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res, next) => {
  let sql = "SELECT * FROM employee; SELECT *, from_unixtime(unix_timestamp(data_survey.time), '%d %M %Y %H:%i:%s') AS timestamp FROM data_survey INNER JOIN origin_value ON data_survey.survey_id=origin_value.survey_id ORDER BY timestamp DESC"

  let query = conn.query(sql, (err, results, survey)=>{
    if(err) throw err;
    res.render('index',{
      data1: results[0],
      data: results[1],
    });
  });
});

app.get('/emp',(req, res) => {
  let sql = "SELECT * FROM employee";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('employee',{
      results: results
    });
  });
});






//route for insert data
app.post('/save',(req, res) => {
  let data = {employee_id: req.body.employee_id, username: req.body.username, password: req.body.password, serial_number: req.body.serial_number};
  let sql = "INSERT INTO employee SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/emp');
  });
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE employee SET username='"+req.body.username+"', password='"+req.body.password+"' WHERE user_id="+req.body.user_id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/emp');
  });
});




//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM employee WHERE user_id="+req.body.user_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/emp');
  });
});

app.get('/org',(req, res) => {
  let sql = "SELECT *, from_unixtime(unix_timestamp(data_survey.time), '%d %M %Y %H:%i:%s') AS timestamp from validasi INNER JOIN data_survey ON validasi.nik = data_survey.nik LEFT JOIN origin_value ON data_survey.survey_id = origin_value.survey_id ORDER BY timestamp DESC";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('org',{
      results: results
    });
  });
});


app.post('/update_org',(req, res) => {
  let sql = "UPDATE validasi SET approval='APPROVED' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/org');
  });
});
app.post('/update2_org',(req, res) => {
  let sql = "UPDATE validasi SET approval='NOT APPROVED' WHERE id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
      res.redirect('/org');
  });
});


//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
