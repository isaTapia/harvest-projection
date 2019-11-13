const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createItemCreationService(
  Plot, 
  function(request) { 
    return {
      userId: request.decodedToken._id,
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude
    }
  },
  '_id name latitude longitude'
)
