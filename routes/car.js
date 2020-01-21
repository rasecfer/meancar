const mongoose = require('mongoose')
const express = require('express')
const Car = require('../models/car')
const Role = require('../helper/role')
const auth = require('../middleware/auth')
const authorize = require('../middleware/role')
// const app = express()

// Router de Express
const router = express.Router()

// Definir variables para express-validation
const { check, validationResult } = require('express-validator')

router.get('/', [auth, authorize([Role.Admin])], async(req, res) => {
  const result = await Car
    .find()
    .populate('brand', 'name country')
  res.send(result)
})

router.get('/:id', async(req, res) => {
  const result = await Car.findById(req.params.id)
  if (!Car) return res.status(404).send("NO se ha encontrado un coche con ese id!")
  res.send(result)
})

router.post('/', [
  // Validaciones
  check('model').not().isEmpty(),
  check('year').isInt({ lte: 2020 })
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const car = new Car({
    brand: req.body.brand,
    model: req.body.model,
    price: req.body.price,
    year: req.body.year,
    sold: req.body.sold,
    extras: req.body.extras
  })
  const result = await car.save()
  res.status(201).send(result)
})

router.put('/:id', [
  // Validaciones
  check('model').not().isEmpty(),
  check('year').isInt({ lte: 2020 })
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const car = await Car.findByIdAndUpdate(req.params.id, {
    brand: req.body.brand,
    model: req.body.model,
    price: req.body.price,
    year: req.body.year,
    sold: req.body.sold,
    extras: req.body.extras
  },
  {
    new: true
  })

  if (!Car) return res.status(404).send("NO se ha encontrado un coche con ese id!")

  res.status(200).send(car)
})

router.delete('/:id', async(req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id)

  if (!Car) return res.status(404).send("NO se ha encontrado un coche con ese id!")

  res.status(200).send("El registro se ha eliminado correctamente!")
})

module.exports = router