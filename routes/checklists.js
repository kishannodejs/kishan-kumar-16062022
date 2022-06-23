const express = require('express');
var multer  = require('multer');
const router  = express.Router();
var commonfunc = require('../commonfunction.js');
const Checklist = require("../models/checklist");
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

router.get('/', commonfunc.isClientAuthenticated, async (req,res)=>{


    try {
     
        res.render('checklist/checklist',{user: req.user });
  } catch(error) {
      res.status(404).json({message: error.message});
  }


})

router.get('/list', commonfunc.isAuthenticatedbutnotInspection, async (req,res)=>{


 var moment = require('moment');
    try {
        const checklist= await Checklist.find();

        console.log(checklist);
      res.render('checklist/list' , {title: 'dashboard' , checklist:checklist, moment:moment})
    } catch(error) {
        res.status(404).json({message: error.message});
    }
})



router.get('/edit/:id', commonfunc.isAdminClientAuthenticated, async(req,res)=>{
    const _id = req.params.id;
    try {
        const checklist = await Checklist.findOne({_id: _id});
      res.render('checklist/edit' , {title: 'dashboard222' , checklist:checklist})
    } catch(error) {
        res.status(404).json({message: error.message});
    }    
})

router.get('/view/:id', commonfunc.isAuthenticatedbutnotInspection, async(req,res)=>{
  const _id = req.params.id;
  try {
      const checklist = await Checklist.findOne({_id: _id});
    res.render('checklist/view' , {title: 'dashboard222' , checklist:checklist})
  } catch(error) {
      res.status(404).json({message: error.message});
  }    
})

router.post('/edit/:id', commonfunc.isAdminClientAuthenticated, upload.single('order_file'), async(req,res)=>{
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


        await Checklist.findOneAndUpdate({
            _id: _id,
        },
        {   
            cooler:req.body.cooler,
            category:req.body.category,
            licence:req.body.licence,
            driver_number:req.body.driver_number,
            vehicle_rc:req.body.vehicle_rc
        }
        )
        req.flash('success_msg','Checklist is successfully Updated!');
        res.redirect('/checklists/list');

    } catch (error) {
        res.status(401).json({message: error.message});
    }


})





router.post('/add', commonfunc.isClientAuthenticated, upload.single('order_file'), async(req,res)=>{



    const {cooler, category, licence, driver_number, vehicle_rc, order_number, order_file} = req.body;

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

    const newChecklist = new Checklist({
        cooler : cooler,
        category : category,
        licence : licence,
        driver_number: driver_number,
        vehicle_rc : vehicle_rc,
        order_number:order_number,
        image_path:req.file.filename
    });

    console.log(newChecklist);

  

    

    try {
        await newChecklist.save()
        req.flash('success_msg','Checklist is successfully Created!');
        res.redirect('/checklists/list');

    } catch(error) {
        res.status(400).json({ message : error.message});
    }

   // res.render('order/list');
})




router.get('/delete/:id', commonfunc.isAdminClientAuthenticated, async(req,res)=>{

  
  const _id = req.params.id;
   
  try{
      await Checklist.findOneAndRemove({ _id: _id});
      res.redirect('/checklists/list');

  } catch (error) {
      res.status(401).json({message: error.message});
  }


})


module.exports = router; 