const passport = require('passport');
const express = require("express");
const multer = require('multer');
require('./controllers/passport')(passport);
const cors = require("cors");
const app = express();
const { format } = require('date-fns');
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const myRouter = require("./routes/index");
const viewRouter = require("./routes/viewRouter");
var responseTime = require('response-time')
const cookieParser = require('cookie-parser');
const auditLogMiddleware = require("./controllers/auditlog/auditlogMiddleware")
const errLogger = require("./controllers/auditlog/errLogger")
const resTime = require("./controllers/auditlog/resTimeLogger")




const fs = require('fs');
var path = require('path')
var rfs = require('rotating-file-stream') // version 2.x

var flash = require('connect-flash');
dotenv.config();    
//connect database
mongoose.connect((process.env.MONGODB_URL),()=>{
    console.log("connected database");
});


 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));



//Loki
 app.use(responseTime(resTime))
 app.use(errLogger)


// // app.use(cookieParser());



// //Static files
 app.use(express.static(__dirname + '/public'));

// // cau hinh engine ejs
// // app.set("view engine", "ejs");
// // app.set("views","./view");

 app.use('/static', express.static('public'))

 app.use(cors());


function logFilename(time) {
    if (!time) return 'access.log';
    return `${format(time, 'yyyy-MM-dd')}-access.log`;
  }

// create a rotating write stream
var accessLogStream = rfs.createStream(logFilename(new Date()), {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '/inforLogger')
})









// setup the logger
app.use(morgan('common', { stream: accessLogStream }))

// API
app.use("/api", myRouter);   
app.use("/", viewRouter);

        
module.exports = app