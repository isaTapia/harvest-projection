const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')




// [TODO] editar ServicesFactory para que reciba la proyeccion antes que los callbacks
module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const hash = await bcrypt.hash(request.body.password, 1)
  const data = {
    name: request.body.name,
    email: request.body.email,
    password: hash
  }
  let createdUser = new User(data)
  createdUser = await createdUser.save()
  const result = {
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    plotsList: createdUser.plotsList
  }
  return result
})
