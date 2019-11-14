const User = require('../../models/user')
const bcrypt = require('bcrypt')
const ServicesFactory = require('../services-factory')




module.exports = async function(request, response) {
  const handleException = ServicesFactory.createOnQueryRejectionCallback(response)
  try {
    const id = request.decodedToken._id
    const data = {}

    const { name, email, password } = request.body
    if (name) {
      data.name = name
    }
    if (email) {
      data.email = email
    }
    if (password) {
      const hash = await bcrypt.hash(password, 1)
      data.password = hash
    }

    const options = {
      new: true,
      select: '_id name email plotsList',
      omitUndefined: true
    }
    const user = await User.findByIdAndUpdate(id, data, options)
    response.json(user)
  } catch (error) {
    handleException(error)
  }
}
