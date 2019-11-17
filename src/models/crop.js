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
    type: String,
    required: true
  },
  projectedHarvestDate: {
    type: String,
    required: true
  }
}


module.exports = ModelsFactory.createModel('Crop', Crop)
