// Middleware de prueba
 function fecha(req, res, next) {
  console.log('Time: ' + Date.now())
  next()
}

module.exports = fecha