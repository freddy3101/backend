const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    _id:Object,
    cod:String,
    cant:Number,
    img:String
})

var stock = mongoose.model('stock',stockSchema);
module.exports = stock;