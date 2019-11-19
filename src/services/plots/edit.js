const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')
const createError = require('../../create-error')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const plot = await Plot.findById(id)
  if (!plot) {
    throw createError('InvalidId', 'Provided plotId does not match any plot owned by you', 400)
  }
  if (plot.owner.toString() !== userId) {
    throw createError('InvalidId', 'Provided plotId does not match any plot owned by you', 400)
  }

  const data = request.body
  const options = { 
    new: true, 
    select: '_id name latitude longitude',
    omitUndefined: true
  }

  return await Plot.findByIdAndUpdate(id, data, options)
})
