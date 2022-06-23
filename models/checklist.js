const mongoose = require('mongoose');
const ChecklistSchema  = new mongoose.Schema({
    cooler :{
      type  : Number,
      required : true
  },
  category :{
    type  : Number,
    required : true
},
licence :{
    type  : Number
},
driver_number :{
    type  : Number
},
vehicle_rc :{
    type  : Number
},
image_path :{
    type  : String,
    required : true
},
order_number :{
    type  : String,
    required : true
},
date :{
    type : Date,
    default : Date.now
}
});
const Checklist= mongoose.model('Checklist',ChecklistSchema);

module.exports = Checklist;