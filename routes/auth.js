const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')

// Router de Express
const router = express.Router()

// Definir variables para express-validation
const { check, validationResult } = require('express-validator')

router.post('/', [
  // Validaciones
  check('email').isEmail(),
  check('password').not().isEmpty()
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let user = await User.findOne({email: req.body.email})
  if(!user) return res.status(400).send("Usuario o contraseña no válidos!")

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if(!validPassword) return res.status(400).send("Usuario o contraseña no válidos!")

  const jwtToken = user.generateJWT()

  res.header('Authorization', jwtToken).send(jwtToken)

})

module.exports = router