const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'containers-us-west-168.railway.app',
	port: 6943,
    user: 'root',
    password: 'CSHc7NSJwHE5TdvIfdcV',
    database: 'railway'
});

app.get("/usercontactdata", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id '+connection.threadId);
			
		connection.query("select * from contactdata", (err, rows)=>{
			if(!err){
				res.send(rows);
			}else{
				console.log(err);
			}
		});
	});
});

app.post("/create", (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id '+connection.threadId);
			
		connection.query("create table contactdata (firstname varchar2(255) not null, lastname varchar2(255) not null, emailaddress varchar2(255) check (emailaddress LIKE '%___@___%.__%'),  phone varchar2(30) check(REGEXP_LIKE(p_number, '^0\d{9}|\d{10}$')), CONSTRAINT PK_contactdata PRIMARY KEY (phone), constraint uq_email unique(emailaddress));", (err, rows)=>{
			if(!err){
				res.send(rows);
			}else{
				console.log(err);
			}
		});
	});
});

app.listen(port, () => {
    console.log('listeneing on port '+ port);
});