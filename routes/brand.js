const mongoose = require('mongoose')
const express = require('express')
const Brand = require('../models/brand')
// const app = express()

// Router de Express
const router = express.Router()

// Definir variables para express-validation
const { check, validationResult } = require('express-validator')

router.get('/', async(req, res) => {
  const result = await Brand.find()
  res.send(result)
})

router.get('/:id', async(req, res) => {
  const result = await Brand.findById(req.params.id)
  if (!result) return res.status(404).send("NO se ha encontrado una marca con ese id!")
  res.send(result)
})

router.post('/', [
  // Validaciones
  check('name').not().isEmpty(),
  check('country').not().isEmpty()
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const brand = new Brand({
    name: req.body.name,
    country: req.body.country,
  })
  const result = await brand.save()
  res.status(201).send(result)
})

router.put('/:id', [
  // Validaciones
  check('name').not().isEmpty(),
  check('country').not().isEmpty()
],async(req, res) => {

  // Verifica si existen errores y los devuelve
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const brand = await Brand.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    country: req.body.country,
  },
  {
    new: true
  })

  if (!brand) return res.status(404).send("NO se ha encontrado una marca con ese id!")

  res.status(200).send(brand)
})

router.delete('/:id', async(req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id)

  if (!brand) return res.status(404).send("NO se ha encontrado una marca con ese id!")

  res.status(200).send("El registro se ha eliminado correctamente!")
})

module.exports = router