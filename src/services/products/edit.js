const Product = require('../../models/product')
const ServicesFactory = require('../services-factory')
const createError = require('../../create-error')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const product = await Product.findById(id)
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

  const data = request.body
  const options = { 
    new: true, 
    select: '_id name maturityThreshold temperatureTolerance temperatureOptimum',
    omitUndefined: true
  }

  return await Product.findByIdAndUpdate(id, data, options)
})
