const express = require('express');
const router = express.Router();

const Stock = require('../../models/stock.model');
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Incio de user router / key'
  })
});
router.get('/stock',async(req, res)=>{
    Stock.find({}, function(err, result){
        if(err){
            consol.log('valor de error',err);
            return
        }
        res.json(result)
    })
})

module.exports = router
