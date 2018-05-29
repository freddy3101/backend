const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bcript = require('bcrypt');

const router = express.Router();

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

const User = require('../../models/user.model');
// router.get('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'Incio de user router / login'
//   })
// });

router.post('/login', async (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  console.log('server', email, password);
  const result = await User.findOne({
    email,
    password

  });
  if (result) {
    return res.json(result);
    console.log('bienvendio');
  } else {
    console.log('acceso denegado')
  }
  res.end();
})

router.post('/signup', (req, res, next) => {
  console.log('valores de email and passwor ', req.body)
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
        result=>{
          res.status(201).json({
            data: result,
            message: 'user account create'
          })
        }
      ).catch(err=>{
        res.status(500).json({
          error: err
        })
      });
    }
  })
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

module.exports = router