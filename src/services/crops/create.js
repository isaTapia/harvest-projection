const ServicesFactory = require('../services-factory')
const History = require('../../models/history')
const Plot = require('../../models/plot')
const Product = require('../../models/product')
const got = require('got')
const moment = require('moment')
const CaloricHoursCalculator = require('../caloric-hours')
const Crop = require('../../models/crop')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const userId = request.decodedToken._id
  const data = request.body

  // revisamos que no se este intentando utilizar una parcela que no nos pertenece
  const plotId = data.plotId
  const plot = await Plot.findById(plotId, '_id name owner latitude longitude')
  if (plot.owner.toString() !== userId) {
    throw new Error('Not allowed to create a crop for a plot that is not yours')
  }

  // revisamos que nos e este intentando utilizar un producto que no nos pertenece
  const productId = data.productId
  const product = await Product.findById(
    productId, '_id name owner maturityThreshold temperatureTolerance temperatureOptimum'
  )
  if (product.owner.toString() !== userId) {
    throw new Error('Not allowed to create a crop for a product that is not yours')
  }

  // obtenemos el historial del año pasado para esta parcela
  const latitude = plot.latitude
  const longitude = plot.longitude
  const searchConditions = { latitude, longitude }
  let history = await History.findOne(searchConditions)

  // si no existe el historial, hay que crearlo
  if (!history) {
    // este paso toma demasiado tiempo
    history = await createWeatherHistoryForLocation(latitude, longitude)
  }

  // revisamos que no se intente generar una proyección de algún año pasado o futuro
  const cultivationDate = moment(data.cultivationDate)
  const currentYear = moment().year()
  if (cultivationDate.year() !== currentYear) {
    throw new Error('Invalid date; provide a date corresponding to the current year')
  }

  // buscamos en el historial los datos climatológicos del año anterior
  const lastYear = currentYear - 1
  let yearlyWeather = history.yearlyWeather.find(element => element.year === lastYear)
  if (!yearlyWeather) {
    // este paso toma demasiado tiempo
    yearlyWeather = await createYearlyWeatherHistory(latitude, longitude, lastYear)
    history.yearlyWeather.push(yearlyWeather)
    history = await history.save()
  }

  // utilizando los datos climatológicos del año anterior, generamos la primera proyección
  const startDate = moment(cultivationDate).subtract(1, 'years')
  const projection = CaloricHoursCalculator.computeAccumulationUntilMaturity(
    product, 
    startDate, 
    yearlyWeather.dailyWeather
  )

  // se crea el cultivo utilizando la proyección obtenida
  const projectedHarvestDate = moment(cultivationDate).add(projection.daysForMaturity, 'days')
  const cropData = { 
    owner: userId,
    plot: plotId, 
    product: productId, 
    cultivationDate: cultivationDate.format('YYYY-MM-DD'), 
    projectedHarvestDate: projectedHarvestDate.format('YYYY-MM-DD')
  }
  let createdCrop = new Crop(cropData)
  createdCrop = await createdCrop.save()
  createdCrop = await Crop
    .findById(createdCrop._id, '_id plot product cultivationDate projectedHarvestDate')
    .populate('plot', '_id name latitude longitude')
    .populate('product', '_id name temperatureTolerance temperatureOptimum')
  return createdCrop
})



async function createWeatherHistoryForLocation(latitude, longitude) {
  const data = { latitude, longitude }
  data.yearlyWeather = []
  const yearlyWeather = await createYearlyWeatherHistory(latitude, longitude)
  data.yearlyWeather.push(yearlyWeather)
  const history = new History(data)
  return await history.save()
}



async function createYearlyWeatherHistory(latitude, longitude, year = moment().year() - 1) {
  const result = {
    year: year,
    dailyWeather: []
  }

  const start = moment([ year ])
  const end = moment(start).endOf('year')

  // [TODO] Esta parte toma demasiado tiempo pues tiene que recuperar los datos de los 365 dias de 
  // forma secuencial antes de proceder
  let current = start
  while (current.format('YYYY-MM-DD') !== end.format('YYYY-MM-DD')) {
    const date = current.unix()
    let dailyWeather = await fetchWeatherData(latitude, longitude, date)

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



async function fetchWeatherData(latitude, longitude, date) {
  const apiKey = process.env.DARKSKY_API_KEY
  const url = 
    `https://api.darksky.net/forecast/${apiKey}/${latitude},${longitude},${date}?units=si&exclude=[alerts,flags,minutely,hourly]`
  const response = await got(url)
  return JSON.parse(response.body)
}
