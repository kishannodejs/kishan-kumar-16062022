const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
var path = require('path');

//passport config:
require('./config/passport')(passport)
//mongoose
mongoose.connect('mongodb://localhost/kishan-kumar-16062022',{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected to MongoD'))
.catch((err)=> console.log(err));

//EJS
app.set('view engine','ejs');

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

 app.use(express.static(path.join(__dirname, 'public')));
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })


//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/orders',require('./routes/orders'));
app.use('/checklists',require('./routes/checklists'));

app.listen(3000); 