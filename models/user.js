const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    required : true
} ,
mobile:{ type : Number, 
    unique : true,
     required : true
    } ,
password :{
    type  : String,
    required : true
} ,
isAdmin: { 
    type: Boolean, 
    default: false, 
    required: true 
},
isOwner: { 
    type: Boolean, 
    default: false, 
    required: true 
},
role: {
    type: Number,
    required: true,
    default: 4, 
    enum: [1,2,3,4]
},
date :{
    type : Date,
    default : Date.now
}
});
const User= mongoose.model('User',UserSchema);

module.exports = User;