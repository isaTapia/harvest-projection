const express = require('express')
const cors = require('cors')
const userServicesRouter = require('./services/users/router')
const sessionServicesRouter = require('./services/session/router')
const plotServicesRouter = require('./services/plots/router')
const productServicesRouter = require('./services/products/router')
const cropServicesRouter = require('./services/crops/router')




const app = express()
app.set('port', process.env.PORT)
app.use(cors())
app.use(express.json())  // recibimos objetos json en las peticiones


// rutas a recursos
app.use('/accounts', userServicesRouter)
app.use('/session', sessionServicesRouter)
app.use('/plots', plotServicesRouter)
app.use('/products', productServicesRouter)
app.use('/crops', cropServicesRouter)


const onServiceError = (error, request, response, next) => {
  console.error(error)
  response.status(500).json({
    name: error.name,
    message: error.message
  })
}
app.use(onServiceError)


module.exports = app
