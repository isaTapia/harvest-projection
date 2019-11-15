const { Router } = require('express')
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createProduct = require('./create')
const retrieveProductsList = require('./retrieve-list')
const editProduct = require('./edit')
const deleteProduct = require('./delete')




const router = Router()
router.route('/')
  .post(checkBearerToken, createProduct)
  .get(checkBearerToken, retrieveProductsList)
router.route('/:id')
  .put(checkBearerToken, editProduct)
  .delete(checkBearerToken, deleteProduct)


module.exports = router
