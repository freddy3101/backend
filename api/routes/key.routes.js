const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Stock = require('../models/stock.model');
const stockController = require('../controllers/stock.controller');
const checkAuth = require('../middleware/check-auth');
// router.get('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'Incio de user router / key'
//   })
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get('/:stockId', checkAuth, (req, res, next) => {
  const id = req.params.stockId;
  Stock.findById(id)
    .select('cod cant img')
    .exec()
    .then(
      doc => {
        if (doc) {
          console.log(doc)
          res.status(200).json({
            response: {
              codigo: doc.cod,
              cantidad: doc.cant,
              imagen: doc.img
            },
            request: {
              type: "GET",
              url: 'http://localhost:3000/' + doc._id
            }
          })
        } else {
          res.status(500).json({
            message: 'invalido id'
          })
        }
      }
    ).catch(err => {
      res.status(500).json({
        err: err.message
      })
    });
})
router.get('/',checkAuth, stockController.stock_get_all);
router.post('/',upload.single('keyimage') , checkAuth, (req, res, next) => {
  const stock = new Stock({
    _id: new mongoose.Types.ObjectId(),
    cod: req.body.cod,
    cant: req.body.cant,
    img: req.file.path
  })
  stock.save()
    .then(result => {
      //  console.log(result)
      res.status(201).json({
        message: 'handlin POST requests to /stock',
        items: {
          codigo: result.cod,
          cantidad: result.cant,
          imagen: result.img,
          request: {
            type: "GET",
            url: "http://localhost:3000/key/" + result._id
          }
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});


router.delete('/:stockId', (req, res, next) => {
  const id = req.params.stockId;
  Stock.findOneAndRemove({
      _id: id
    }).exec()
    .then(
      result => {
        if (result) {
          res.status(200).json({
            response: {
              codigo: result.cod,
              cantidad: result.cant,
              imagen: result.img
            },
            request: {
              type: "GET",
              url: 'http://localhost:3000/key/'
            }

          })
          console.log('documento removido exitosamente')
        } else {
          res.status(500).json({
            response: 'no exites el articulo con el id ' + id
          })
        }
      }

    ).catch(
      err => {
        res.status(500).json({
          error: err,
          message: 'error al intentar eliminar registro contactar con administradodr'
        })
      }
    )
})

router.put('/', (req, res, next) => {
  const _id = req.body.stockId;

  Stock.findByIdAndUpdate(_id, req.body, {
    new: true
  }).exec().then(
    doc => {
      res.status(200).json({
        response: doc,
        request: {
          type: "GET",
          url: 'http://localhost:3000/key/' + _id
        }
      })
    }
  ).catch(
    err => {
      res.status(500).json({
        error: err.message
      })
    }
  )
})
module.exports = router