const { Router } = require('express') 
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createUser = require('./create')
const retrieveSingleUser = require('./retrieve-single')
const editUser = require('./edit')




const router = Router()
router.route('/')
  .get(checkBearerToken, retrieveSingleUser)
  .post(createUser)
  .put(checkBearerToken, editUser)


module.exports = router
