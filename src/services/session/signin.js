const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')
const webtoken = require('jsonwebtoken')
const CropsListService = require('../crops/retrieve-list')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const searchCriteria = { email: request.body.email }
  const user = await User
    .findOne(searchCriteria, '_id name email password plotsList productsList cropsList')
    .populate('plotsList', '_id name latitude longitude')
    .populate('productsList', '_id name maturityThreshold temperatureTolerance')

  if (!user) {
    console.info(`User email '${request.body.email}' not found during authentication`)
    throw new Error('User authentication failed')
  }

  const areEqual = await bcrypt.compare(request.body.password, user.password)
  if (!areEqual) {
    console.info(`User '${request.body.email}' password is not correct`)
    throw new Error('User authentication failed')
  }

  const payload = {
    _id: user._id
  }
  const config = {
    expiresIn: '8h' // [TODO] la sesion permanece abierta por 8 horas
  }
  const token = webtoken.sign(payload, process.env.JSON_WEB_TOKEN_SECRET_KEY, config)
  request.decodedToken = { _id: user._id }
  const cropsList = await CropsListService.getCropsList(request, response)
  return {
    token: token,
    _id: user._id,
    name: user.name,
    email: user.email,
    plotsList: user.plotsList,
    productsList: user.productsList,
    cropsList: cropsList
  }
})
