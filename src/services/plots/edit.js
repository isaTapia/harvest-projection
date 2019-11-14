const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




// [TODO] aquí hay un bug donde el usuario puede editar parcelas que no son suyas
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
