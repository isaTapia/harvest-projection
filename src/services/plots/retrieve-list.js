const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




// [TODO] aquí hay un bug donde el usuario puede editar parcelas que no son suyas
module.exports = ServicesFactory.createItemsListRetrievalService(
  Plot, 
  request => { 
    return {
      userId: request.decodedToken._id 
    }
  },
  '_id name latitude longitude'
)
