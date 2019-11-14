const User = require('../../models/user')
const ServicesFactory = require('../services-factory')
const bcrypt = require('bcrypt')




// [TODO] editar ServicesFactory para que reciba la proyeccion antes que los callbacks
module.exports = function(request, response) {
  const onPasswordHashed = (error, hash) => {
    if (error) {
      console.error(error)
      throw new Error('Failed to hash the user password')
    }

    const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
    const onQueryFulfillment = document => {
      if (document) {
        const result = {}
        const fieldsList = '_id name email'.split(' ')
        for (field of fieldsList) {
          result[field] = document.get(field)
        }
        result['plotsList'] = []
        response.json(result)
      } else {
        response.json(document)
      }
    }

    const data = {
      name: request.body.name,
      email: request.body.email,
      password: hash
    }
    const item = new User(data)
    item.save()
      .then(onQueryFulfillment)
      .catch(onQueryRejection)
  }

  bcrypt.hash(request.body.password, 1, onPasswordHashed)
}
