const Product = require('../../models/product')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const product = await Product.findById(id)
  if (product.owner.toString() !== userId) {
    throw new Error('Not allowed to edit a product that is not yours')
  }

  const data = request.body
  const options = { 
    new: true, 
    select: '_id name maturingThreshold temperatureTolerance temperatureOptimum',
    omitUndefined: true
  }

  return await Product.findByIdAndUpdate(id, data, options)
})
