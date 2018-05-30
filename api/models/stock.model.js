const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    cod:String,
    cant:{type:Number, required:true},
    img:{type:String, required:true}

})

var stock = mongoose.model('Stock',stockSchema);
module.exports = stock;