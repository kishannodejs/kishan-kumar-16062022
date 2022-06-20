const express = require('express');
var multer  = require('multer');
const router  = express.Router();
const Order = require("../models/order");


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
      if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
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
router.get('/', (req,res)=>{
    res.render('order/order',{user: req.user });
})

router.get('/list', async (req,res)=>{
 //   res.render('order/list',{user: req.user });
 var moment = require('moment');
    try {
        const order= await Order.find();
      res.render('order/list' , {title: 'dashboard' , order:order, moment:moment})
    } catch(error) {
        res.status(404).json({message: error.message});
    }
})

router.get('/edit/:id', async(req,res)=>{
    const _id = req.params.id;
    try {
        const order = await Order.findOne({_id: _id});
      res.render('order/edit' , {title: 'dashboard222' , order:order})
    } catch(error) {
        res.status(404).json({message: error.message});
    }    
})

router.post('/edit/:id', upload.single('order_file'), async(req,res)=>{
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
            note:req.body.note
        }
        )
        res.redirect('/orders/list');

    } catch (error) {
        res.status(401).json({message: error.message});
    }


})





router.post('/add', upload.single('order_file'), async(req,res)=>{

    console.log(req.body);

    console.log(req.files);

    const {cooler, category, licence, driver_number, vehicle_rc, note, order_file} = req.body;

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
        image_path:req.file.filename
    });

    console.log(newOrder);

  

    

    try {
        await newOrder.save()

        res.redirect('/orders/list');

    } catch(error) {
        res.status(400).json({ message : error.message});
    }

   // res.render('order/list');
})



module.exports = router; 