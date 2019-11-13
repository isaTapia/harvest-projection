const { Router } = require('express')
const signIn = require('./signin')




const router = Router()
router.route('/')
  .post(signIn)


module.exports = router
