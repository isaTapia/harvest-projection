const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const CropsListService = require('../crops/retrieve-list')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.decodedToken._id
  const user = await User
    .findById(id, '_id name email plotsList')
    .populate('plotsList', '_id name latitude longitude')
    .populate('productsList', '_id name maturityThreshold temperatureTolerance temperatureOptimum')
  const cropsList = await CropsListService.getCropsList(request, response)
  user.cropsList = cropsList
  return user
})
