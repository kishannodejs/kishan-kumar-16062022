const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
var commonfunc = require('../commonfunction.js');

//login handle
router.get('/login',(req,res)=>{
    res.render('login', {title: 'Login'});
})

router.get('/imlogin',(req,res)=>{
    res.render('inspection-login.ejs', {title: 'Inspection Manager Login'});
})

router.get('/register', commonfunc.isAdminAuthenticated, (req,res)=>{
    res.render('register', {title: 'Register'})
    })
//Register handle
// router.post('/login',(req,res,next)=>{



// passport.authenticate('local',{
//     successRedirect : '/dashboard',
//     failureRedirect: '/users/login',
//     failureFlash : true
// }
// )


// (req,res,next)
// })


router.get('/list', commonfunc.isAdminAuthenticated, async (req,res)=>{

    session = req.session;
  
    console.log(session);
  
 
   var moment = require('moment');
      try {
          const user= await User.find({"role": {$ne : 1}});
        res.render('user/list' , {title: 'List User' , user:user, moment:moment})

        
      } catch(error) {
          res.status(404).json({message: error.message});
      }
  })


router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/users/login', failureFlash : true }),
  function(req, res) {


    session = req.session;
					session.userid = req.user._id;
					session.email = req.user.email;
					session.name = req.user.name;
					session.role = req.user.role;
                    session.mobile = req.user.mobile;

   // res.redirect('/dashboard');

    res.redirect('/'+req.authInfo.myurl);
  });


  
router.post('/imlogin', 
passport.authenticate('local', { failureRedirect: '/users/imlogin', failureFlash : true }),
function(req, res) {

    console.log(req.body);

  session = req.session;
                  session.userid = req.user._id;
                  session.email = req.user.email;
                  session.name = req.user.name;
                  session.role = req.user.role;
                  session.mobile = req.user.mobile;

 // res.redirect('/dashboard');

  res.redirect('/'+req.authInfo.myurl);
});


  //register post handle
  router.post('/register', commonfunc.isAdminAuthenticated, (req,res)=>{
    const {name,email, mobile, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name+ ' email :' + email+ ' mobile :' + mobile+ ' pass:' + password);
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
    if(errors.length > 0 ) {
    res.render('register', {
        errors : errors,
        name : name,
        email : email,
        mobile : mobile,
        password : password,
        password2 : password2})
     } else {
        //validation passed
       User.findOne({$or: [{email: email},{mobile: mobile}, ],}).exec((err,user)=>{
        console.log(user);  
        // console.log(email);  
        // console.log(mobile);  
        console.log("AAAAAAAAAAAAa");  

    //   //  console.log(user.email);  

    //     if (typeof user.email== null) {
    //         user.email = '';
    //         //Do something since x is defined.
    //     }


    //     if (typeof user.mobile== null) {
    //         user.mobile = '';
    //         //Do something since x is defined.
    //     }



        // console.log(user.mobile);   

       
        if(user) {

            if(user.email==email && user.mobile==mobile){
                var mymsg = "Email and mobile already registered.";
            } else if(user.email==email){
                var mymsg = "Email already registered.";
            } else if(user.mobile==mobile){
                var mymsg = "Mobile already registered.";
            }

            
            errors.push({msg: mymsg});
            res.render('register',{errors,name,email,password,password2})  
           } else {
            const newUser = new User({
                name : name,
                email : email,
                mobile : mobile,
                password : password
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/users/list');
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })
//logout

router.get('/edit/:id', commonfunc.isAdminAuthenticated, async(req,res)=>{
    const _id = req.params.id;
    try {
        const user = await User.findOne({_id: _id});
        console.log(user);
      res.render('user/edit' , {title: 'Edit User' , user:user})
    } catch(error) {
        res.status(404).json({message: error.message});
    }    
})


router.post('/edit/:id', commonfunc.isAdminAuthenticated, async(req,res)=>{
    const _id = req.params.id;
     
    try{    

        console.log("req.body.role",req.body.role);

        await User.findOneAndUpdate({
            _id: _id,
        },
        {   
            role:req.body.role
        }
        )
        req.flash('success_msg','User updated successfully!');
        res.redirect('/users/list');

    } catch (error) {
        res.status(401).json({message: error.message});
    }


})


router.get('/delete/:id', commonfunc.isAuthenticated, async(req,res)=>{

  
    const _id = req.params.id;
     
    try{
        await User.findOneAndRemove({ _id: _id});
        res.redirect('/users/list');
  
    } catch (error) {
        res.status(401).json({message: error.message});
    }
  
  
  })

router.get("/logout", (req, res) => {
    
    req.logout(req.user, err => {
      if(err) return next(err);
      req.session.destroy();
      res.redirect("/");
    });
  });

module.exports  = router;