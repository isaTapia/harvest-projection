const { Router } = require('express')
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createCrop = require('./create')
const deleteCrop = require('./delete')
const CropsListService = require('./retrieve-list')




const router = Router()
router.route('/')
  .post(checkBearerToken, createCrop)
  .get(checkBearerToken, CropsListService.callback)
router.route('/:id')
  .delete(checkBearerToken, deleteCrop)


module.exports = router
