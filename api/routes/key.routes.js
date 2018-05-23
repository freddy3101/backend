const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Stock = require('../../models/stock.model');
// router.get('/', (req, res, next) => {
//   res.status(200).json({
//     message: 'Incio de user router / key'
//   })
// });
router.get('/:stockId', (req, res, next) => {
  const id = req.params.stockId;
  Stock.findById(id).exec().then(
    doc => {
      console.log(doc)
      res.json(doc)
    }
  ).catch(err => {
    console.log(err)
  });
})
router.get('/', (req, res) => {
  Stock.find().exec()
    .then(doc => {
      res.json(doc)
    })
    .catch(err => {
        res.json({
          message: 'error al intentar recuperar registros',
          status: false,
          error: err
        })
      }

    );
});
router.post('/', (req, res, next) => {
  const stock = new Stock({
    _id: new mongoose.Types.ObjectId(),
    cod: req.body.cod,
    cant: req.body.cant,
    img: req.body.img
  })
  stock.save()
    .then(result => {
      console.log(result)
    })
    .catch(err => console.log(err));

  res.status(200).json({
    message: 'manejar post agregar stock',
    createStock: stock
  })
})

module.exports = router
