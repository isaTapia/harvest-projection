const Plot = require('../../models/plot')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const createError = require('../../create-error')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const plot = await Plot.findById(id, '_id name owner latitude longitude')
  if (!plot) {
    throw createError('InvalidId', 'Provided plotId does not match any plot owned by you', 400)
  }
  if (plot.owner.toString() !== userId) {
    throw createError('InvalidId', 'Provided plotId does not match any plot owned by you', 400)
  }

  const user = await User.findById(userId)
  user.plotsList.pull(id)
  return await plot.remove()
})
