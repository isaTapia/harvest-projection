const User = require('../../models/user')
const ServicesFactory = require('../services-factory')




module.exports = ServicesFactory.createSingleItemRetrievalService(
  User, 
  (request) => request.decodedToken._id,
  '_id name email'
)
