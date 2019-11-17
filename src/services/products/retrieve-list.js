const Product = require('../../models/product')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createItemsListRetrievalService(
  Product, '_id name maturityThreshold temperatureTolerance temperatureOptimum', 
  request => {
    return { owner: request.decodedToken._id }
  }
)
