const Stock = require('../models/stock.model')


module.exports.stock_get_all =  (req, res) => {
    Stock.find()
      .select('_id cod cant img')
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
            message: 'error al intentar recuperar registros',
            status: false,
            error: err
          })
        }
  
      );
  }