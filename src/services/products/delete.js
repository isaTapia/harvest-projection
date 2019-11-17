const Product = require('../../models/product')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const product = await Product.findById(
    id, '_id name owner maturityThreshold temperatureTolerance temperatureOptimum'
  )
  if (product.owner.toString() !== userId) {
    throw new Error('Not allowed to delete a product that is not yours')
  }

  const user = await User.findById(userId)
  user.productsList.pull(id)
  return await product.remove()
})
