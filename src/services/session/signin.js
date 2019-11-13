const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')
const webtoken = require('jsonwebtoken')




module.exports = function(request, response) {
  const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
  const onQueryFulfillment = document => {
    if (!document) {
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

      const payload = {
        _id: document._id,
        name: document.name,
        email: document.email
      }
      const config = {
        expiresIn: '1h'
      }
      const token = webtoken.sign(payload, process.env.JSON_WEB_TOKEN_SECRET_KEY, config)
      
      const result = {
        _id: document._id,
        name: document.name,
        email: document.email,
        token: token,
        productsList: document.productsList,
        plotsList: document.plotsList
      }
      response.json(result)
    }

    bcrypt.compare(request.body.password, document.password, onHashComparison)
  }

  const where = { email: request.body.email }
  User.findOne(where)
    .then(onQueryFulfillment)
    .catch(onQueryRejection)
}
