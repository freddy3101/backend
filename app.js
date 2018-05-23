const express = require('express');
const bcript = require('bcrypt');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');


const userRouter = require('./api/routes/user.routes');
const keyRouter = require('./api/routes/key.routes');

mongoose.Promise = Promise;
const saltRounds = 12;
mongoose.connect('mongodb://freddy32:freddy123@ds049935.mlab.com:49935/dataproyect')
.then(()=>{
    console.log('conexión al servidor exitosa')
})
.catch((err)=>{
    console.log(`error al conextar al servidor: ${err.message}`)
})

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.get('/',(req, res)=>{
    res.setHeader('Content-Type', 'text/html');
    res.send('hola desde nodejs');
});

app.use('/user',userRouter);
app.use('/key',keyRouter);
// app.post('/api/login',async(req, res)=>{
//     const {email, password} = req.body;
//     console.log('server', email, password);
//  const result = await User.findOne({email,password});
//  if (result){
//     return res.json(result);
//      console.log('bienvendio');
//  }else{
//      console.log('acceso denegado')
//  }
// res.end();
// })

// app.get('/api/stock',async(req, res)=>{
//     Stock.find({},function(err, result){
//         if(err){
//             consol.log('valor de error',err);
//             return
//         }
//         res.json(result)
//     })
// })

app.listen(PORT,()=>{
    console.log(`servidor ejecutandose en el puerto ${PORT}`);
})
