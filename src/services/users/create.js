const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const hash = await bcrypt.hash(request.body.password, 1)
  const data = {
    name: request.body.name,
    email: request.body.email,
    password: hash
  }
  let user = new User(data)
  await user.save()
  user = await User.findById(user._id, '_id name email plotsList productsList cropsList')
  return user
})
