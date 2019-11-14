const ModelsFactory = require('./models-factory')
const { Schema } = require('mongoose')




const Plot = {
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
