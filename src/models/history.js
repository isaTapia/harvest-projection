const ModelsFactory = require('./models-factory')




const DailyWeather = {
  time: Number,
  temperatureMin: Number,
  temperatureMax: Number
}


const YearlyWeather = {
  year: {
    type: Number,
    required: true
  },
  dailyWeather: [DailyWeather]
}


const History = {
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  yearlyWeather: [YearlyWeather]
}


module.exports = ModelsFactory.createModel('History', History)
