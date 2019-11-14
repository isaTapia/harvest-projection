const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')




// [TODO] editar ServicesFactory para que reciba la proyeccion antes que los callbacks
module.exports = async function(request, response) {
  const handleException = ServicesFactory.createOnQueryRejectionCallback(response)
  try {
    const hash = await bcrypt.hash(request.body.password, 1)
    const data = {
      name: request.body.name,
      email: request.body.email,
      password: hash
    }
    const createdUser = new User(data)
    user = await createdUser.save()
    const result = {
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
