const mysql = require('mysql');
const express = require('express');
const cors = require("cors");
var app = express();

app.use(cors());
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'UserTable',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));

//Get an employees
app.get('/user', (req, res) => {
    mysqlConnection.query('SELECT * FROM usertable ', (err, rows) => {
        if (!err || res.status(200))
            res.send({
                "status": true,
                "message": "Get User Data Successful",
                "user": rows
            });
        else
            res.send({
                "status": false,
                "message": "User Data Not Access",
                "error": err
            });
    })
});

// //Get an employees
app.get('/user/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM usertable WHERE emp_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err || res.status(200))
            res.send({
                "status": true,
                "message": "Get User Data Successful",
                "user": rows
            });
        else
            res.send({
                "status": false,
                "message": "User Data Not Access",
                "error": err
            });
    })
});

//Insert an employees
app.post('/user', (req, res) => {
    let emp = req.body;
    var sql = "SET @emp_id = ?;SET @name = ?;SET @age = ?;\
    CALL EmployeeAddOrEdit(@emp_id,@name,@age);";
    mysqlConnection.query(sql, [emp.emp_id, emp.name, emp.age], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if (element.constructor == Array)
                    res.send('Inserted User : ' + element[0].emp_id);
            });
        else
            console.log(err);
    })
});


//Delete an employees
app.delete('/user/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM usertable WHERE id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send({ 'message': 'User Deleted successfully.' });
        else
            console.log(err);
    })
});