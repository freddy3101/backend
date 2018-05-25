const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    cod:String,
    cant:{type:Number, required:true},
    img:String
})

var stock = mongoose.model('Stock',stockSchema);
module.exports = stock;