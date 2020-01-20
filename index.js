const mongoose = require('mongoose')
const express = require('express')
const app = express()
// Definir el router
const car = require('./routes/car')
const user = require('./routes/user')
const brand = require('./routes/brand')
const sale = require('./routes/sale')
const auth = require('./routes/auth')
// Habilitar el parseo de JSON en express
app.use(express.json())
app.use('/api/cars/', car)
app.use('/api/users/', user)
app.use('/api/brands/', brand)
app.use('/api/sales/', sale)
app.use('/api/auth/', auth)

// Definir el puerto, ya sea el asginado por el servidor o uno en específico
const port = process.env.PORT || 2012

app.listen(port, () => {
  console.log('Escuchando en el puerto ' + port + '...')
})

mongoose.connect('mongodb://localhost/carsdb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
  .then(() => console.log('Conexión exitosa a la base carsdb'))
  .catch(() => console.log('Ocurrió un error al conectarse a la base carsdb'))