const ModelsFactory = require('./models-factory')
const { ObjectId } = require('mongoose')




const Product = {
  userId: {
    type: ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  maturingThreshold: {
    type: Number,
    required: true,
    min: 0
  },
  temperatureTolerance: {
    type: {
      min: {
        type: Number,
        required: true,
        min: 0
      },
      max: {
        type: Number,
        required: true,
        min: 0
      }
    },
    validate: {
      message: 'temperatureToleranceMax must be greater than temperatureToleranceMin',
      validator: value => Promise.resolve(value.min < value.max)
    }
  }
}


module.exports = ModelsFactory.createModel('Plot', Plot)
