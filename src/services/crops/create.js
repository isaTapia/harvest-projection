const ServicesFactory = require('../services-factory')
const History = require('../../models/history')
const Plot = require('../../models/plot')
const Product = require('../../models/product')
const moment = require('moment')
const CaloricHoursCalculator = require('../caloric-hours')
const Crop = require('../../models/crop')
const User = require('../../models/user')
const WeatherHistoryFactory = require('../weather-history')




module.exports = ServicesFactory.createCustomService(async (request, response) => {
  const userId = request.decodedToken._id
  const data = request.body

  // revisamos que no se este intentando utilizar una parcela que no nos pertenece
  const plotId = data.plotId
  const plot = await Plot.findById(plotId, '_id name owner latitude longitude')
  if (!plot) {
    throw new Error('Invalid plot ID provided')
  }
  if (plot.owner.toString() !== userId) {
    throw new Error('Not allowed to create a crop for a plot that is not yours')
  }

  // revisamos que nos e este intentando utilizar un producto que no nos pertenece
  const productId = data.productId
  const product = await Product.findById(
    productId, '_id name owner maturityThreshold temperatureTolerance temperatureOptimum'
  )
  if (!product) {
    throw new Error('Invalid product ID provided')
  }
  if (product.owner.toString() !== userId) {
    throw new Error('Not allowed to create a crop for a product that is not yours')
  }

  // revisamos que no se intente generar una proyección de algún año pasado o futuro
  const cultivationDate = moment(data.cultivationDate)
  const currentYear = moment().year()
  if (cultivationDate.year() !== currentYear) {
    throw new Error('Invalid date; provide a date corresponding to the current year')
  }
  const lastYear = currentYear - 1

  // obtenemos el historial del año pasado para esta parcela
  const latitude = plot.latitude
  const longitude = plot.longitude
  const searchConditions = { latitude, longitude }
  let history = await History.findOne(searchConditions)

  // si no existe el historial, hay que crearlo
  if (!history) {
    // este paso toma demasiado tiempo
    history = await WeatherHistoryFactory.createYearlyHistory(latitude, longitude, lastYear)
  }

  // buscamos en el historial los datos climatológicos del año anterior
  let yearlyWeather = history.yearlyWeather.find(element => element.year === lastYear)
  if (!yearlyWeather) {
    // este paso toma demasiado tiempo
    yearlyWeather = await WeatherHistoryFactory.createDailyHistory(latitude, longitude, lastYear)
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
  let crop = new Crop(cropData)
  crop = await crop.save()
  const user = await User.findById(userId).populate('cropsList')
  user.cropsList.push(crop._id)
  await user.save()
  crop = await Crop
    .findById(crop._id, '_id plot product cultivationDate projectedHarvestDate updatedAt')
    .populate('plot', '_id name latitude longitude')
    .populate('product', '_id name temperatureTolerance temperatureOptimum')
  return crop
})
