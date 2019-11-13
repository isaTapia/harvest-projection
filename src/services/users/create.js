const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')




module.exports = function(request, response) {
  const onPasswordHashed = (error, hash) => {
    if (error) {
      console.error(error)
      throw new Error('Failed to hash the user password')
    }

    const createUser = ServicesFactory.createItemCreationService(
      User, 
      req => {
        return {
          name: req.body.name,
          email: req.body.email,
          password: hash
        }
      },
      '_id name email'
    )
    createUser(request, response)
  }

  bcrypt.hash(request.body.password, 1, onPasswordHashed)
}
