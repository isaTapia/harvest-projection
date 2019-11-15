const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')
const webtoken = require('jsonwebtoken')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const searchCriteria = { email: request.body.email }
  const user = await User
    .findOne(searchCriteria, '_id name email password plotsList')
    .populate('plotsList', '_id name latitude longitude')

  if (!user) {
    console.info(`User email '${request.body.email}' not found during authentication`)
    throw new Error('User authentication failed')
  }

  const areEqual = await bcrypt.compare(request.body.password, user.password)
  if (!areEqual) {
    console.info(`User '${request.body.email}' password is not correct`)
    throw new Error('User authentication failed')
  }

  const config = {
    expiresIn: '1h'
  }
  const token = webtoken.sign(user._id, process.env.JSON_WEB_TOKEN_SECRET_KEY, config)
  const result = {
    token: token,
    _id: user._id,
    name: user.name,
    email: user.email,
    plotsList: user.plotsList
  }
  return result
})
