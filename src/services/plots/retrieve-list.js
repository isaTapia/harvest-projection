const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.decodedToken._id
  const searchConditions = { owner: id }
  const plotsList = await Plot.find(searchConditions, '_id name latitude longitude')
  return { data: plotsList }
})
