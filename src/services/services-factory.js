const ServicesFactory = {}
ServicesFactory.createOnQueryFulfillmentCallback = function(response) {
  return document => response.json(document)
}



ServicesFactory.createOnQueryRejectionCallback = function(response) {
  return error => {
    console.error(error)
    const report = {
      name: error.name,
      message: error.message
    }
    response.status(500).json(report)
  }
}



ServicesFactory.createCustomService = function(action) {
  return async function(request, response) {
    const handleError = ServicesFactory.createOnQueryRejectionCallback(response)
    try {
      const result = await action(request, response)
      response.json(result)
    } catch (error) {
      handleError(error)
    }
  }
}



ServicesFactory.createItemCreationService = function(model, fieldsFilter, getItemData) {
  return ServicesFactory.createCustomService(async (request, response) => {
    const data = getItemData(request)
    let item = new model(data)
    item = await item.save()
    item = await model.findById(item._id, fieldsFilter)
    return item
  })
}



ServicesFactory.createSingleItemRetrievalService = function(model, fieldsFilter, getItemId) {
  return ServicesFactory.createCustomService(async (request, response) => {
    const id = getItemId(request)
    const item = await model.findById(id, fieldsFilter)
    return item
  })
}



ServicesFactory.createItemsListRetrievalService = function(model, fieldsFilter, getSearchConditions)
{
  return ServicesFactory.createCustomService(async (request, response) => {
    const searchConditions = getSearchConditions(request)
    const itemsList = await model.find(searchConditions, fieldsFilter)
    return itemsList
  })
}



ServicesFactory.createItemEditionService = function(model, fieldsFilter, getItemData) {
  return ServicesFactory.createCustomService(async (request, response) => {
    const id = request.params.id
    const data = getItemData(request)
    const options = { 
      new: true, 
      select: fieldsFilter,
      omitUndefined: true
    }
    const item = await model.findByIdAndUpdate(id, data, options)
    return item
  })
}



ServicesFactory.createItemDeletionService = function(model, fieldsFilter) {
  return ServicesFactory.createCustomService(async (request, response) => {
    const id = request.params.id
    const options = { select: fieldsFilter }
    model.findByIdAndDelete(id, options)
  })
}



module.exports = ServicesFactory
