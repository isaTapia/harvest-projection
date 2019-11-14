const Plot = require('../../models/plot')
const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




// [TODO] de nuevo, hay que editar el webtoken para agregar el cultivo creado
module.exports = async function(request, response) {
  const handleError = ServicesFactory.createOnQueryRejectionCallback(response)
  try {
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
    response.json(plot)
  } catch (error) {
    handleError(error)
  }
}
