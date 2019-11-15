const { Router } = require('express')
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createProduct = require('./create')
const retrieveProductsList = require('./retrieve-list')




const router = Router()
router.route('/')
  .get(checkBearerToken, retrieveProductsList)
  .post(checkBearerToken, createProduct)


module.exports = router
