const ModelsFactory = require('./models-factory')
const { ObjectId } = require('mongoose')




const Plot = {
  userId: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
}


module.exports = ModelsFactory.createModel('Plot', Plot)
