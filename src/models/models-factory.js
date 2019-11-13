const { Schema, model } = require('mongoose')




const ModelsFactory = {

  createModel: function(name, fieldsDescriptor, config = { timestamps: true }) {
    const schema = new Schema(fieldsDescriptor, config)
    return model(name, schema)
  }
}


module.exports = ModelsFactory
