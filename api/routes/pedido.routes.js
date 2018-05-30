const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Pedido = require('../models/pedido.model');
const Stocks = require('../models/stock.model');

router.get('/:orderId', (req, res, next) => {
    Pedido.findById(req.params.orderId)
        .exec()
        .then(
            result => {
                if(!result){
                    return res.status(404).json({
                        message: 'pedido con id ' + req.params.orderId + ' no encontrado'
                    })
                }
                res.status(200).json({
                    response: {
                        id: result._id,
                        cant: result.cant,
                        idstock: result.stock
                    },
                    message: 'pedidoid recuperado',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/pedido/'
                    }
                })
            }
        ).catch(
            err => {
                res.status(500).json({
                    error: err.message
                })
            }
        );
})
router.get('/', (req, res) => {
    Pedido.find()
        .select('cant _id stock')
        .populate('stock')
        .exec()
        .then(doc => {
            //if (doc.length > 0){
            const response = {
                count: doc.length,
                items: doc.map(doc => {
                    return {
                        cant: doc.cant,
                        _id: doc._id,
                        stock: doc.stock,

                        request: {
                            type: "GET",
                            url: "http://localhost:3000/pedido/" + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
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
    Stocks.findById(req.body.stockId)
        .then(stock => {
            if (!stock) {
                return res.status(404).json({
                    message: "Codigo de Stock no existe"
                })
            }
            const pedido = new Pedido({
                _id: new mongoose.Types.ObjectId(),
                cant: req.body.cant,
                stock: req.body.stockId
            })
            return pedido.save();
        })

        .then(result => {

            res.status(201).json({
                message: 'pedido guardado ',
                pedidoCreado: {
                    id: result._id,
                    stock: result.stock,
                    cant: result.cant
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/pedido/' + result._id
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            })
        });
});


// router.delete('/:stockId', (req, res, next) => {
//     const id = req.params.stockId;
//     console.log('valor de id', id)
//     Stock.findOneAndRemove({
//             _id: id
//         }).exec()
//         .then(
//             result => {
//                 if (result) {
//                     res.status(200).json({
//                         response: {
//                             codigo: result.cod,
//                             cantidad: result.cant,
//                             imagen: result.img
//                         },
//                         request: {
//                             type: "GET",
//                             url: 'http://localhost:3000/key/'
//                         }

//                     })
//                     console.log('documento removido exitosamente')
//                 } else {
//                     res.status(500).json({
//                         response: 'no exites el articulo con el id ' + id
//                     })
//                 }
//             }

//         ).catch(
//             err => {
//                 res.status(500).json({
//                     error: err,
//                     message: 'error al intentar eliminar registro contactar con administradodr'
//                 })
//             }
//         )
// })

// router.put('/', (req, res, next) => {
//     const _id = req.body.stockId;

//     Stock.findByIdAndUpdate(_id, req.body, {
//         new: true
//     }).exec().then(
//         doc => {
//             res.status(200).json({
//                 response: doc,
//                 request: {
//                     type: "GET",
//                     url: 'http://localhost:3000/key/' + _id
//                 }
//             })
//         }
//     ).catch(
//         err => {
//             res.status(500).json({
//                 error: err.message
//             })
//         }
//     )
// })
router.delete('/:pedidoId', (req, res, next) => {
    Pedido.findByIdAndRemove(req.params.pedidoId).exec().then(
        result => {
            res.status(200).json({
                message: 'pedido eliminado'
            })
        }
    ).catch(
        err => {
            res.status(500).json({
                error: err.message
            })
        }
    );
})
module.exports = router