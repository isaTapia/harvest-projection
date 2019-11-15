const Plot = require('../../models/plot')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const id = request.params.id
  const userId = request.decodedToken._id
  const plot = await Plot.findById(id, '_id name owner latitude longitude')
  if (plot.owner.toString() !== userId) {
    throw new Error('Not allowed to delete a plot that is not yours')
  }

  const user = await User.findById(userId)
  user.plotsList.pull(id)
  return await plot.remove()
})
