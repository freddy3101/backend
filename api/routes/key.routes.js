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
      if (doc) {
        console.log(doc)
        res.status(200).json(doc)
      } else {
        res.status(500).json({
          message: 'invalido id'
        })
      }
    }
  ).catch(err => {
    res.status(500).json({
      err: err
    })
  });
})
router.get('/', (req, res) => {
  Stock.find().exec()
    .then(doc => {
    //if (doc.length > 0){
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
      res.status(201).json({
        message: 'handlin POST requests to /stock'
      })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
          error: err
        })
      }



    );

  res.status(200).json({
    message: 'manejar post agregar stock',
    createStock: stock
  })
});


router.delete('/:stockId', (req, res, next) => {
  const id = req.params.stockId;
  console.log('valor de id' ,id)
  Stock.findOneAndRemove({
      _id: id
    }).exec()
    .then(
      result => {
        res.status(200).json(result)
        console.log('documento removido exitosamente')
      }
    ).catch(
      err => {
        res.status(500).json({
          error: err,
          message:'error al intentar eliminar registro contactar con administradodr'
        })
      }
    )
})

router.patch('/',(req, res, next)=>{
  const _id = req.body.stockId;

  Stock.findByIdAndUpdate(_id, req.body,{new:true}).exec().then(
    doc=>{
      res.status(20).json(doc)
    }
  ).catch(
    err=>{
      res.status(500).json({
        error:err
      })
    }
  )
})
module.exports = router
