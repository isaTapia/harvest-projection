const Plot = require('../../models/plot')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const data = request.body
  let plot = new Plot(data)

  const userId = request.decodedToken._id
  const user = await User
    .findById(userId, '_id name email plotsList')
    .populate('plotsList')
  
  plot.owner = user._id
  plot = await plot.save()
  user.plotsList.push(plot._id)
  await user.save()
  plot = await Plot.findById(plot._id, '_id name latitude longitude')
  return plot
})
