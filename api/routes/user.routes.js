const express = require('express');
const router = express.Router();
const User = require('../../models/user.model');
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Incio de user router / login'
  })
});

router.post('/login', async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  console.log('server', email, password);
  const result = await User.findOne({
    email,
    password
  });
  if (result) {
    return res.json(result);
    console.log('bienvendio');
  } else {
    console.log('acceso denegado')
  }
  res.end();
})
module.exports = router
