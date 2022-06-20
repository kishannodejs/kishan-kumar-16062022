const mongoose = require('mongoose');
const OrderSchema  = new mongoose.Schema({
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
note :{
    type  : String
},
image_path :{
    type  : String,
    required : true
},
status: {
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
const Order= mongoose.model('Order',OrderSchema);

module.exports = Order;