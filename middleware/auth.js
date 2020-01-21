const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const jwtToken = req.header('Authorization')
  if(!jwtToken) return res.status(401).send("Sin autorización! Se necesita un token.")

  try {
    const payload = jwt.verify(jwtToken, process.env.SECRET_KEY_API_CARSDB)
    req.user = payload
    next()
  } catch (error) {
    return res.status(400).send("Sin autorización! Token Inválido")
  }
}

module.exports = auth