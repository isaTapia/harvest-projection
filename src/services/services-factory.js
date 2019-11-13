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



ServicesFactory.createItemCreationService = function(model, getItemData, fieldsToReturn) {
  return (request, response) => {
    const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
    const onQueryFulfillment = document => {
      if (document) {
        const result = {}
        const fieldsList = fieldsToReturn.split(' ')
        for (field of fieldsList) {
          result[field] = document.get(field)
        }
        response.json(result)
      } else {
        response.json(document)
      }
    }

    const data = getItemData(request)
    const item = new model(data)
    item.save()
      .then(onQueryFulfillment)
      .catch(onQueryRejection)
  }
}



ServicesFactory.createSingleItemRetrievalService = function(model, getItemId, fieldsToReturn) {
  return (request, response) => {
    const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
    const onQueryFulfillment = ServicesFactory.createOnQueryFulfillmentCallback(response)
    
    const id = getItemId(request)
    const options = { select: fieldsToReturn }
    model.findById(id, null, options)
      .then(onQueryFulfillment)
      .catch(onQueryRejection)
  }
}



ServicesFactory.createItemsListRetrievalService = function(model, getQueryFilter, fieldsToReturn) {
  return (request, response) => {
    const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
    const onQueryFulfillment = ServicesFactory.createOnQueryFulfillmentCallback(response)

    const filter = getQueryFilter(request)
    const options = { select: fieldsToReturn }
    model.find(filter, null, options)
      .then(onQueryFulfillment)
      .catch(onQueryRejection)
  }
}



ServicesFactory.createItemEditionService = function(
  model, 
  getItemData, 
  fieldsToReturn,
  getItemId = request => request.params.id, 
) {
  return (request, response) => {
    const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
    const onQueryFulfillment = ServicesFactory.createOnQueryFulfillmentCallback(response)

    const id = getItemId(request)
    const data = getItemData(request)
    const options = { 
      new: true, 
      select: fieldsToReturn,
      omitUndefined: true
    }
    model.findByIdAndUpdate(id, data, options)
      .then(onQueryFulfillment)
      .catch(onQueryRejection)
  }
}



ServicesFactory.createItemDeletionService = function(model, fieldsToReturn) {
  return (request, response) => {
    const onQueryRejection = ServicesFactory.createOnQueryRejectionCallback(response)
    const onQueryFulfillment = ServicesFactory.createOnQueryFulfillmentCallback(response)

    const id = request.params.id
    const options = { select: fieldsToReturn }
    model.findByIdAndDelete(id, options)
      .then(onQueryFulfillment)
      .catch(onQueryRejection)
  }
}



module.exports = ServicesFactory
