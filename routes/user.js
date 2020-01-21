const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const express = require('express')
const User = require('../models/user')
// const app = express()

// Router de Express
const router = express.Router()

// Definir variables para express-validation
const { check, validationResult } = require('express-validator')

router.get('/', async(req, res) => {
  const result = await User.find()
  res.send(result)
})

router.get('/:id', async(req, res) => {
  const result = await User.findById(req.params.id)
  if (!result) return res.status(404).send("NO se ha encontrado un usuario con ese id!")
  res.send(result)
})

router.post('/', [
  // Validaciones
  check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').not().isEmpty()
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let user = await User.findOne({email: req.body.email})
  if(user) return res.status(400).send("El email ya está en uso.")

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  user = new User({
    name: req.body.name,
    isCustomer: false,
    email: req.body.email,
    password: hashPassword
  })
  const result = await user.save()

  const jwtToken = user.generateJWT()

  res.status(201).header('Authorization', jwtToken).send({
    _id: result._id,
    name: result.name,
    email: result.email
  })
})

router.put('/:id', [
  // Validaciones
  check('name').not().isEmpty(),
  check('email').isEmail(),
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const user = await User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    isCustomer: req.body.isCustomer,
    email: req.body.email,
  },
  {
    new: true
  })

  if (!user) return res.status(404).send("NO se ha encontrado un usuario con ese id!")

  res.status(200).send(user)
})

router.delete('/:id', async(req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) return res.status(404).send("NO se ha encontrado un usuario con ese id!")

  res.status(200).send("El registro se ha eliminado correctamente!")
})

module.exports = router