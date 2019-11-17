const ModelsFactory = require('./models-factory')
const { Schema } = require('mongoose')




const Crop = {
  plot: {
    type: Schema.Types.ObjectId,
    ref: 'Plot',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  cultivationDate: {
    type: Date,
    required: true
  },
  projectedHarvestDate: {
    type: Date,
    required: true
  }
}


module.exports = ModelsFactory.createModel('Crop', Crop)
