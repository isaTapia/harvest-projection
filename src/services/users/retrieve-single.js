const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = async function(request, response) {
  const handleException = ServicesFactory.createOnQueryRejectionCallback(response)
  try {
    const id = request.decodedToken._id
    const user = await User
      .findById(id, '_id name email plotsList')
      .populate('plotsList', '_id name latitude longitude')
    response.json(user)
  } catch (error) {
    handleException(error)
  }
}
