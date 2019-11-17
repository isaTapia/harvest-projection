const { Router } = require('express')
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createCrop = require('./create')
const deleteCrop = require('./delete')




const router = Router()
router.route('/')
  .post(checkBearerToken, createCrop)
router.route('/:id')
  .delete(checkBearerToken, deleteCrop)


module.exports = router
