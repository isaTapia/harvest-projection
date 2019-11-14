const User = require('../../models/user')
const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')
const webtoken = require('jsonwebtoken')




// [TODO] ver si se pude implementar con async/await
// [TODO] no todos los errores son capturados por express
module.exports = function(request, response) {
  const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
  const onUserEmailFound = user => {
    if (!user) {
      console.info('User email not found during authentication')
      throw new Error('User authentication failed')
    }

    const onHashComparison = (error, areEqual) => {
      if (error) {
        console.error(error)
        throw new Error('User authentication failed')
      }

      if (!areEqual) {
        console.info('User password is not correct')
        throw new Error('User authentication failed')
      }

      const config = {
        expiresIn: '1h'
      }
      const token = webtoken.sign(user.toJSON(), process.env.JSON_WEB_TOKEN_SECRET_KEY, config)
      
      const onPlotsListRetrieved = plotsList => {
        const result = {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: token,
          plotsList: plotsList
        }
        response.json(result)
      }

      const where = { userId: user._id }
      Plot.find(where, '_id name latitude longitude')
        .then(onPlotsListRetrieved)
        .catch(onQueryRejection)
    }

    bcrypt.compare(request.body.password, user.password, onHashComparison)
  }

  const where = { email: request.body.email }
  User.findOne(where, '_id name email password')
    .then(onUserEmailFound)
    .catch(onQueryRejection)
}
