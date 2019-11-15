const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.decodedToken._id
  const user = await User
    .findById(id, '_id name email plotsList')
    .populate('plotsList', '_id name latitude longitude')
    .populate('productsList', '_id name maturingThreshold temperatureTolerance')
  response.json(user)
})
