const { Router } = require('express')
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createCrop = require('./create')




const router = Router()
router.route('/')
  .post(checkBearerToken, createCrop)


module.exports = router
