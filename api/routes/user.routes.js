const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bcript = require('bcrypt');
const jwt  = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user.model');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/png' || file.mimetype == 'imge/jpg') {
    cb(null, true);
  } else {
    db(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})


// router.get('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'Incio de user router / login'
//   })
// });

router.post('/login',  (req, res, next) => {
 User.find({email: req.body.email}).exec().then(
   user=>{
     if(user.length < 1){
       return res.status(401).json({
         result: user,
         message:'no exite usuario con el email'
       })
     }
     bcript.compare(req.body.password, user[0].password,(err,result)=>{
        if(err){
          return res.status(401).json({
            error:err.message,
            message:'fallo la utentificacion'
          })
        }
        if(result){
         const token= jwt.sign({
            email:user[0].email,
            userId: user[0]._id
          },
          process.env.JWT_KEY,
          {
            expiresIn:"1h"
          }
        );
          return res.status(200).json({
            message:'autentificacion satisfactoria',
            token:token
          })
        }
        res.status(401).json({
          message:'no exite usuario con el email o el password es incorrecto'
        })
     })
   }
 ).catch(
   err=>{
     res.status(500).json({
       error:err.message
     })
   }
 )
})

router.post('/signup', (req, res, next) => {
  //TODO haxer algo po aqui
  User.find({
    email: req.body.email
  }).exec().then(
    user => {
      if (user.length >=1) {
        return res.status(409).json({
          message: 'ya exites un usuario con ese correo'
        })
      } else {
        bcript.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err.message
            })
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash

            });
            user.save().then(
              result => {
                res.status(201).json({
                  data: result,
                  message: 'usuario fue creado ok'
                })
              }
            ).catch(err => {
              res.status(500).json({
                error: err
              })
            });
          }
        })

      }
    }
  ).catch(
    err => {
      res.status(500).json({
        error: err.message
      })
    }
  );


});

router.get('/', (req, res) => {
  User.find()
    .select('email  password')
    .exec()
    .then(doc => {
      //if (doc.length > 0){
      // const response = {
      //   // count: doc.length,
      //   items: doc.map(doc => {
      //     return {
      //       cod: doc.cod,
      //       cant: doc.cant,
      //       img: doc.img,
      //       // request: {
      //       //   type: "GET",
      //       //   url: "http://localhost:3000/key/" + doc._id
      //       // }
      //     }
      //   })
      // }
      res.status(200).json(doc)
      //}
      // else{
      // res.status(404).json({
      //   message:'no existen registros para mostrar'
      // })
      // }
    })
    .catch(err => {
        res.json({
          message: 'error al intentar recuperar todos lo usuaios',
          status: false,
          error: err
        })
      }

    );
});

router.delete('/:userId',(req, res, next)=>{
  User.findOneAndRemove({_id: req.params.userId}).exec().then(
    result=>{
      res.status(200).json({
        message:'usuario eleminado del sistema'
      })
    }
  ).catch(
    err=>{
      res.status(500).json({
        error: err.message
      })
    }
  )
})

module.exports = router