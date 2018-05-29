const express = require('express');

const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');


const userRouter = require('./api/routes/user.routes');
const keyRouter = require('./api/routes/key.routes');
const pedidoRouter = require('./api/routes/pedido.routes');

const corsOptions={
  // origin:'http://localhost:4200',
  origin:'http://localhost:4200',
  optionsSuccessStatus:200
}
mongoose.Promise = global.Promise;
const saltRounds = 12;
// mongoose.connect('mongodb://freddy32:freddy123@ds049935.mlab.com:49935/dataproyect')
mongoose.connect('mongodb+srv://freddy:' + process.env.MONGO_ATLAS_PW + '@cluster0-bklg8.mongodb.net/test?retryWrites=true')
  .then(() => {
    console.log('conexión al servidor exitosa')
  })
  .catch((err) => {
    console.log(`error al conextar al servidor: ${err.message}`)

  })

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))
app.use(cors(corsOptions));
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send('hola desde nodejs');
});

app.use('/user', userRouter);
app.use('/key', keyRouter);
app.use('/pedido', pedidoRouter);

app.listen(PORT, () => {
  console.log(`servidor ejecutandose en el puerto ${PORT}`);
})
