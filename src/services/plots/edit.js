const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createItemEditionService(
  Plot, 
  function(request) {
    return {
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude
    }
  },
  '_id name latitude longitude'
)
