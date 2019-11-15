const Product = require('../../models/product')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createItemsListRetrievalService(
  Product, '_id name maturingThreshold temperatureTolerance', 
  request => {
    return { owner: request.decodedToken._id }
  }
)