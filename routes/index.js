const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
var commonfunc = require('../commonfunction.js');

//login page
router.get('/', (req,res)=>{
    res.render('welcome', {title: 'Home'});
})
//register page
router.get('/register', commonfunc.isAuthenticated, (req,res)=>{
    res.render('register', {title: 'Register'});
})

router.get('/dashboard', commonfunc.isAuthenticated,(req,res)=>{

    session = req.session;
    var name = session.name;

     res.render('dashboard',{user: req.user, name:name, session:session, title: 'Admin Dashboard' });
    })


router.get('/manager', commonfunc.isAuthenticated,(req,res)=>{

    session = req.session;
    var name = session.name;


res.render('dashboard',{user: req.user, name:name, title: 'Manager Dashboard' });
})

router.get('/client', commonfunc.isAuthenticated,(req,res)=>{

    session = req.session;
    var name = session.name;

res.render('dashboard_client',{user: req.user, name:name, title: 'Client Dashboard' });
})

module.exports = router; 