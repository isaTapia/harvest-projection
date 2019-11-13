const User = require('../../models/user')
const bcrypt = require('bcrypt')
const ServicesFactory = require('../services-factory')




module.exports = function(request, response) {
  const onPasswordHashed = (error, hash) => {
    if (error) {
      console.error(error)
      throw new Error('Failed to hash the user password')
    }

    const editUser = ServicesFactory.createItemEditionService(
      User,
      req => {
        return {
          name: req.body.name,
          email: req.body.email,
          password: hash
        }
      },
      '_id name email',
      req => req.decodedToken._id
    )
    editUser(request, response)
  }

  bcrypt.hash(request.body.password, 1, onPasswordHashed)
}
