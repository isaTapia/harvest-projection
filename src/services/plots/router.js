const { Router } = require('express') 
const checkBearerToken = require('../../middlewares/check-bearer-token')
const createPlot = require('./create')
const retrievePlotsList = require('./retrieve-list')
const editPlot = require('./edit')
const deletePlot = require('./delete')




const router = Router()
router.route('/')
  .post(checkBearerToken, createPlot)
  .get(checkBearerToken, retrievePlotsList)
router.route('/:id')
  .put(checkBearerToken, editPlot)
  .delete(checkBearerToken, deletePlot)


module.exports = router
