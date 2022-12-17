const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'containers-us-west-168.railway.app',
	port: "6943",
	//port: 6943,
    user: 'root',
    password: 'CSHc7NSJwHE5TdvIfdcV',
	connectionLimit: 10,
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

app.post("/insertcontactdata", (req, res) => {
	
	pool.getConnection((err, connection) => {
		if(err) throw err
		console.log('connected as id '+connection.threadId);
		const firstname = req.body.firstname;
		const lastname = req.body.firstname;
		const emailaddress = req.body.firstname;
		const phone = req.body.firstname;
		
		/*[firstname, lastname] is an array with the values inside it*/
		connection.query("inser into contactdata (firstname, lastname, emailaddress, phone) values(?,?,?,?)", [firstname, lastname, email, mitteilung], (err, rows) => {
			if(err){
				console.log(err);
			}else{
				res.send('Tupel with the record firstname: '+firstname+' has been added');
			}
		});
	});
	
});



app.listen(port, () => {
    console.log('listeneing on port '+ port);
});