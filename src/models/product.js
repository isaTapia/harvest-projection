const ModelsFactory = require('./models-factory')
const { Schema } = require('mongoose')




const Product = {
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
      message: 'TemperatureToleranceMax must be greater than TemperatureToleranceMin',
      validator: value => Promise.resolve(value.min < value.max)
    }
  },
  temperatureOptimum: {
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
      message: 'TemperatureOptimalMax must be greater than TemperatureToleranceMin',
      validator: value => Promise.resolve(value.min < value.max)
    } 
  }
}


module.exports = ModelsFactory.createModel('Product', Product)
