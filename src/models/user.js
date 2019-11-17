const ModelsFactory = require('./models-factory')
const { Schema } = require('mongoose')




const User = {
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    trim: true,
    validate: {
      message: 'User email does not have the proper format',
      validator: value => {
        // No es mio, copiado de aqui: http://emailregex.com/
        const emailRegex = 
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
        const isValid = emailRegex.test(value)
        return Promise.resolve(isValid)
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  plotsList: [{
    type: Schema.Types.ObjectId,
    ref: 'Plot',
    required: true
  }],
  productsList: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  cropsList: [{
    type: Schema.Types.ObjectId,
    ref: 'Crop',
    required: true
  }]
}


module.exports = ModelsFactory.createModel('User', User)
