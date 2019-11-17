const got = require('got')
const moment = require('moment')
const History = require('../models/history')




const WeatherHistoryFactory = {}
WeatherHistoryFactory.fetchWeatherData = async function(latitude, longitude, date) {
  const apiKey = process.env.DARKSKY_API_KEY
  const url = 
    `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${date}?units=si&exclude=[alerts,flags,minutely,hourly]`
  const response = await got(url)
  console.info(`Fetched ${moment(date * 1000).format('YYYY-MM-DD')}`)
  return JSON.parse(response.body)
}



WeatherHistoryFactory.createDailyHistory = async function(latitude, longitude, year) {
  const result = {
    year: year,
    dailyWeather: []
  }

  const start = moment([ year ])
  const currentYear = moment().year()
  const end = (year === currentYear) ? moment() : moment(start).endOf('year')

  // [TODO] Esta parte toma demasiado tiempo pues tiene que recuperar los datos de los 365 dias de 
  // forma secuencial antes de proceder
  let current = start
  while (current.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')) {
    const date = current.unix()
    let dailyWeather = await WeatherHistoryFactory.fetchWeatherData(latitude, longitude, date)

    if (dailyWeather.daily) {
      dailyWeather = dailyWeather.daily.data[0]
      const weather = {
        time: dailyWeather.time,
        temperatureMin: dailyWeather.temperatureMin,
        temperatureMax: dailyWeather.temperatureMax
      }
      result.dailyWeather.push(weather)
    }

    current = current.add(1, 'days')
  }

  return result
}



WeatherHistoryFactory.createYearlyHistory = async function(latitude, longitude, year) {
  const data = { latitude, longitude }
  data.yearlyWeather = []
  const yearlyWeather = await WeatherHistoryFactory.createDailyHistory(latitude, longitude, year)
  data.yearlyWeather.push(yearlyWeather)
  const history = new History(data)
  return await history.save()
}



module.exports = WeatherHistoryFactory
