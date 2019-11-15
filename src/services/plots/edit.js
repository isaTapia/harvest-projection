const Plot = require('../../models/plot')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const plot = await Plot.findById(id)
  if (plot.owner.toString() !== userId) {
    throw new Error('Not allowed to edit a plot that is not yours')
  }

  const data = request.body
  const options = { 
    new: true, 
    select: '_id name latitude longitude',
    omitUndefined: true
  }

  return await Plot.findByIdAndUpdate(id, data, options)
})
