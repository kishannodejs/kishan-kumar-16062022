const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
var commonfunc = require('../commonfunction.js');

//login page
router.get('/', commonfunc.isAuthenticated, (req,res)=>{
    res.render('welcome');
})
//register page
router.get('/register', commonfunc.isAuthenticated, (req,res)=>{
    res.render('register');
})

router.get('/dashboard', commonfunc.isAuthenticated,(req,res)=>{

    session = req.session;
    var name = session.name;

     res.render('dashboard',{user: req.user, name:name, session:session });
    })


router.get('/manager', commonfunc.isAuthenticated,(req,res)=>{

    session = req.session;
    var name = session.name;


res.render('dashboard',{user: req.user, name:name });
})

router.get('/client', commonfunc.isAuthenticated,(req,res)=>{

    session = req.session;
    var name = session.name;

res.render('dashboard_client',{user: req.user, name:name });
})

module.exports = router; 