const express = require('express');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const path = require('path');

 const app = express();
 app.use(fileUpload({
    createParentPath: true
}));
const http = require('http');


//add other middleware
//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
 //app.use('/api/profile/upload', express.static(path.join(__dirname, '/uploads')));
 //app.use('/routes/api/uploads',express.static('/routes/api/uploads/'));
// connect db
connectDB();
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.use(cors())
//init middelware
app.use('/public', express.static(__dirname + '/public'));
app.use(express.json({extended: false}));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/rdv', require('./routes/api/rendezVous'));
app.use('/api/notify', require('./routes/api/notification'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/messages', require('./routes/api/messages'));
const server = http.Server(app);

const PORT =  process.env.PORT || 5000;

 server.listen(PORT, () => console.log(`Server started on port ${PORT}`));