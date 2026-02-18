require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cookieparser = require('cookie-parser');
app.use(cookieparser());


app.use(express.json());
app.use(express.static('public'));

const registeruser = require('./routes/reg');
app.use('/registeruser',registeruser);

const login =require('./routes/login');
app.use('/login',login);

const applicants = require('./routes/applicants');
app.use('/applicants',applicants);

const getnames= require('./routes/getapplicants');
app.use('/getnames',getnames);

const tablefunc = require('./routes/table');
app.use('/tablefunc',tablefunc);

const allusers = require('./routes/display');
app.use('/allusers',allusers);

const money = require('./routes/budget');
app.use('/money',money);

const Logout = require('./logout/LOG');
app.use('/Logout',Logout);

app.listen(port,()=>{
console.log(`your app is live at http://localhost:${port}`);
})