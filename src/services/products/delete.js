const Product = require('../../models/product')
const User = require('../../models/user')
const Crop = require('../../models/crop')
const ServicesFactory = require('../services-factory')
const createError = require('../../create-error')
const moment = require('moment')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const product = await Product.findById(
    id, '_id name owner maturityThreshold temperatureTolerance temperatureOptimum'
  )
  if (!product) {
    throw createError(
      'InvalidId', 
      'Provided productId does not match any product owned by you', 
      400
    )
  }
  if (product.owner.toString() !== userId) {
    throw createError(
      'InvalidId', 
      'Provided productId does not match any product owned by you', 
      400
    )
  }

  const searchFilter = { product: product._id }
  const cropsList = await Crop.find(searchFilter)
  if (cropsList) {
    const today = moment()
    const activeCrops = cropsList.find(
      crop => today.unix() <= moment(crop.projectedHarvestDate).unix()
    )
    if (activeCrops) {
      throw createError(
        'DeletionDenied',
        'Unable to delete product; there are active crops using it',
        400
      )
    }
  }

  const user = await User.findById(userId)
  user.productsList.pull(id)
  return await product.remove()
})
