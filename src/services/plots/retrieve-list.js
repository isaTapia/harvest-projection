const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createItemsListRetrievalService(
  Plot, '_id name latitude longitude', 
  request => {
    return { owner: request.decodedToken._id }
  }
)
