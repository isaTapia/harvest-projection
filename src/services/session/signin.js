const User = require('../../models/user')
const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')
const webtoken = require('jsonwebtoken')




// [TODO] ver si se pude implementar con async/await
// [TODO] no todos los errores son capturados por express
module.exports = async function(request, response) {
  const handleException = ServicesFactory.createOnQueryRejectionCallback(response)
  try {
    const searchCriteria = { email: request.body.email }
    const user = await User
      .findOne(searchCriteria, '_id name email password plotsList')
      .populate('plotsList')

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
    const token = webtoken.sign(user.toJSON(), process.env.JSON_WEB_TOKEN_SECRET_KEY, config)
    const result = {
      token: token,
      _id: user._id,
      name: user.name,
      email: user.email,
      plotsList: user.plotsList
    }
    response.json(result)
  } catch (error) {
    console.error(error)
    handleException(error)
  }
}
