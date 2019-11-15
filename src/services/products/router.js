const { Router } = require('express')
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createProduct = require('./create')




const router = Router()
router.route('/')
  .post(checkBearerToken, createProduct)


module.exports = router
