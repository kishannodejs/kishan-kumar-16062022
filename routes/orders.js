const express = require('express');
var multer  = require('multer');
const router  = express.Router();
var commonfunc = require('../commonfunction.js');
const Order = require("../models/order");
const User = require("../models/user");



const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "./public/images/uploads/");
      },
      filename(req, file, cb) {
        cb(null, `${new Date().getTime()}_${file.originalname}`);
      },
    }),
    limits: {
      fileSize: 1000000, // max file size 1MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|jfif)$/)) {
        return cb(
          new Error(
            "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
          )
        );
      }
      cb(undefined, true); // continue with upload
    },
  });


//login page

router.get('/', commonfunc.isAuthenticated, async (req,res)=>{


    try {
      const userclient= await User.find({role : 4});
      console.log(userclient);
        res.render('order/order',{user: req.user, userclient:userclient, title: 'Create Order' });
  } catch(error) {
      res.status(404).json({message: error.message});
  }


})

router.get('/list', commonfunc.isAuthenticated, async (req,res)=>{

  session = req.session;

  console.log(session);

 //   res.render('order/list',{user: req.user });
 var moment = require('moment');
    try {
        const order= await Order.find();

        console.log(order);
      res.render('order/list' , {title: 'List Order' , order:order, moment:moment})
    } catch(error) {
        res.status(404).json({message: error.message});
    }
})



router.get('/myorders', commonfunc.isAuthenticated, async (req,res)=>{

  session = req.session;

  console.log(session);

  console.log(session.userid);

 //   res.render('order/list',{user: req.user });
 var moment = require('moment');
    try {
        const order= await Order.find({order_number:session.userid});

        console.log(order);
      res.render('order/myorder' , {title: 'My orders' , order:order, moment:moment})
    } catch(error) {
        res.status(404).json({message: error.message});
    }
})


router.get('/edit/:id', commonfunc.isAuthenticated, async(req,res)=>{
    const _id = req.params.id;
    try {
        const order = await Order.findOne({_id: _id});
      res.render('order/edit' , {title: 'Edit Order' , order:order})
    } catch(error) {
        res.status(404).json({message: error.message});
    }    
})

router.get('/view/:id', commonfunc.isAuthenticated, async(req,res)=>{
  const _id = req.params.id;
  try {
      const order = await Order.findOne({_id: _id});
    res.render('order/view' , {title: 'View Order' , order:order})
  } catch(error) {
      res.status(404).json({message: error.message});
  }    
})

router.post('/edit/:id', commonfunc.isAuthenticated, upload.single('order_file'), async(req,res)=>{
    const _id = req.params.id;
     
    try{

        // if (req.file) {
        //     console.log(req.file);
        //     res.send({
        //       status: true,
        //       message: " 111111111111111 File Uploaded!",
        //     });
        //   } else {
        //     res.status(400).send({
        //       status: false,
        //       data: "File Not Found :(",
        //     });
        //   }


        await Order.findOneAndUpdate({
            _id: _id,
        },
        {   
            note:req.body.note,
            status:req.body.status
        }
        )
        req.flash('success_msg','Order is successfully Updated!');
        res.redirect('/orders/list');

    } catch (error) {
        res.status(401).json({message: error.message});
    }


})





router.post('/add', commonfunc.isAuthenticated, upload.single('order_file'), async(req,res)=>{

    console.log(req.body);

    console.log(req.files);

    const {cooler, category, licence, driver_number, vehicle_rc, note, order_number, order_file} = req.body;

    //    if (req.file) {
    //         console.log(req.file);
    //         res.send({
    //           status: true,
    //           message: " 111111111111111 File Uploaded!",
    //         });
    //       } else {
    //         res.status(400).send({
    //           status: false,
    //           data: "File Not Found :(",
    //         });
    //       }

    const newOrder = new Order({
        cooler : cooler,
        category : category,
        licence : licence,
        driver_number: driver_number,
        vehicle_rc : vehicle_rc,
        note : note,
        order_number:order_number,
        image_path:req.file.filename
    });

    console.log(newOrder);

  

    

    try {
        await newOrder.save()
        req.flash('success_msg','Order is successfully Created!');
        res.redirect('/orders/list');

    } catch(error) {
        res.status(400).json({ message : error.message});
    }

   // res.render('order/list');
})




router.get('/delete/:id', commonfunc.isAuthenticated, async(req,res)=>{

  
  const _id = req.params.id;
   
  try{
      await Order.findOneAndRemove({ _id: _id});
      res.redirect('/orders/list');

  } catch (error) {
      res.status(401).json({message: error.message});
  }


})


module.exports = router; 