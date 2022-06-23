const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport){
    
    passport.use(
        new LocalStrategy({usernameField: 'email'},(email,password,done)=>{

            console.log(email);

           let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
           if(email.match(regexEmail)){
            var mobile="";
           } else {
            var mobile=email;
            var email = "";
           }


          // return;


            //match user
             User.findOne({$or: [{email: email},{mobile: mobile}, ],})
          //  User.findOne({email:email})
            .then((user)=>{
                if(!user){
                    return done(null,false,{message:'email not registered'});
                }
                //math passwords
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                      //  console.log("PPPPPPPPPP",user)
                        var myurl="";
                        if(user.role==1){
                            myurl = "dashboard";
                        } else if(user.role==4) {
                            myurl = "client";
                        } else{
                            myurl = "manager";
                        }
                        return done(null,user,{myurl:myurl});
                    } else{
                        return done(null,false,{message: 'password incorrect'});
                    }
                })
            })
            .catch((err)=>{console.log(err)})
        })
    )
    passport.serializeUser(function(user,done) {
        done(null,user.id);
    })
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    })
}