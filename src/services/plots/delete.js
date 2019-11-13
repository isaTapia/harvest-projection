const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




// [TODO] aqui hay un bug donde el usuario puede borrar parcelas que no son suyas
module.exports = ServicesFactory.createItemDeletionService(Plot, '_id name latitude longitude')
