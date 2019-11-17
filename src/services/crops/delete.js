const Crop = require('../../models/crop')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const crop = await Crop
    .findById(id, '_id owner plot product cultivationDate projectedHarvestDate')
    .populate('plot', '_id name latitude longitude')
    .populate('product', '_id name maturityThreshold temperatureTolreance temperatureOptimum')
  if (crop.owner.toString() !== userId) {
    throw new Error('Not allowed to delete a crop that is not yours')
  }

  const user = await User.findById(userId)
  user.cropsList.pull(id)
  return await crop.remove()
})
