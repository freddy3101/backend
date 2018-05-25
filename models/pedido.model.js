const mongoose = require('mongoose');

const pedidoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    cant: {
        type: Number,
        required: true
    }

})

var pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = pedido;