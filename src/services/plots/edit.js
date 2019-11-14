const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  let plot = await Plot.findById(id)
  if (plot.owner.toString() !== userId) {
    throw new Error('Can\'t delete plots that do not belong to you')
  }

  const data = request.body
  const options = { 
    new: true, 
    select: '_id name latitude longitude',
    omitUndefined: true
  }

  const item = await Plot.findByIdAndUpdate(id, data, options)
  return item
})
