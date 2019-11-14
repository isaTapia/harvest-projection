const User = require('../../models/user')
const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = function(request, response) {
  const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
  // const onQueryFulfillment = ServicesFactory.createOnQueryFulfillmentCallback(response)
  const onUserFound = user => {
    const onPlotsListRetrieved = plotsList => {
      const result = {
        _id: user._id,
        name: user.name,
        email: user.email,
        plotsList: plotsList
      } 
      response.json(result)
    }
    
    const where = { userId: user._id }
    Plot.findOne(where, '_id name latitude longitude')
      .then(onPlotsListRetrieved)
      .catch(onQueryRejection)
  }
  
  const id = request.decodedToken._id
  const options = { select: '_id name email' }
  model.findById(id, null, options)
    .then(onUserFound)
    .catch(onQueryRejection)
}
// ServicesFactory.createSingleItemRetrievalService(
//   User, 
//   (request) => request.decodedToken._id,
//   '_id name email'
// )
