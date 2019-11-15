const Product = require('../../models/product')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const data = request.body
  let product = new Product(data)

  const userId = request.decodedToken._id
  const user = await User
    .findById(userId)
    .populate('productsList')
  
  product.owner = user._id
  product = await product.save()
  user.productsList.push(product._id)
  await user.save()
  product = await Product.findById(product._id, '_id name maturingThreshold temperatureTolerance')
  return product
})
