const User = require('../../models/user')
const bcrypt = require('bcrypt')
const ServicesFactory = require('../services-factory')




// [TODO] invalidar viejo token despues de cambiar los datos del usuario y 
// retornar un nuevo token con los datos nuevos
module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.decodedToken._id
  const data = request.body

  if (data.password) {
    const hash = await bcrypt.hash(data.password, 1)
    data.password = hash
  }

  const options = {
    new: true,
    select: '_id name email plotsList',
    omitUndefined: true
  }
  const user = await User.findByIdAndUpdate(id, data, options)
  return user
})
