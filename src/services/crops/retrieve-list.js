const ServicesFactory = require('../services-factory')
const Crop = require('../../models/crop')
const moment = require('moment')
const History = require('../../models/history')
const WeatherHistoryFactory = require('../weather-history')
const CaloricHoursCalculator = require('../caloric-hours')




const CropsListService = {}
CropsListService.getCropsList = async function(request, response) {
    const searchFilter = { owner: request.decodedToken._id }
    const cropsList = await Crop
      .find(searchFilter, '_id plot product cultivationDate projectedHarvestDate updatedAt')
      .populate('plot', '_id name latitude longitude')
      .populate('product', '_id name maturityThreshold temperatureTolerance temperatureOptimum')

    for (const crop of cropsList) {
      const current = moment()
      let harvest = moment(crop.projectedHarvestDate)
      if (harvest.unix() <= current.unix()) {
        continue
      }

      const lastUpdated = moment(crop.updatedAt)
      const currentYear = current.year()
      if (current.format('YYYY-MM-DD') !== lastUpdated.format('YYYY-MM-DD')) {
        // suponemos que deben existir datos historicos para la parcela, pues se crearon al crear 
        // el cultivo
        const searchFilter = { 
          latitude: crop.plot.latitude,
          longitude: crop.plot.longitude
        }
        let history = await History.findOne(searchFilter)
        let yearlyWeather = history.yearlyWeather.find(element => element.year === currentYear)
        if (!yearlyWeather) {
          // este proceso toma demasiado tiempo
          yearlyWeather = await WeatherHistoryFactory.createDailyHistory(
            crop.plot.latitude,
            crop.plot.longitude,
            currentYear
          )
          history.yearlyWeather.push(yearlyWeather)
          history = await history.save()
          yearlyWeather = history.yearlyWeather.find(element => element.year === currentYear)
        }

        let date = moment(crop.cultivationDate)
        let caloricHoursSum = 0
        let maturityReached = false
        let daysCount = 0
        while (date.format('YYYY-MM-DD') !== current.format('YYYY-MM-DD')) {
          let dailyWeather = yearlyWeather.dailyWeather.find(element => 
            moment(element.time * 1000).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
          )
          
          if (!dailyWeather) {
            const weather = await WeatherHistoryFactory.fetchWeatherData(
              crop.plot.latitude,
              crop.plot.longitude,
              date.unix()
            )

            if (!weather.daily) {
              date = moment(date).add(1, 'days')
              continue
            }

            dailyWeather = {
              time: weather.daily.data[0].time,
              temperatureMin: weather.daily.data[0].temperatureMin,
              temperatureMax: weather.daily.data[0].temperatureMax
            }
            yearlyWeather.dailyWeather.push(dailyWeather)
            history = await history.save()
          }

          const caloricHours = CaloricHoursCalculator.computeForSingleDay(
            dailyWeather.temperatureMin,
            dailyWeather.temperatureMax,
            crop.product.temperatureTolerance,
            crop.product.temperatureOptimum
          )
          caloricHoursSum += caloricHours
          ++daysCount

          if (crop.product.maturityThreshold <= caloricHoursSum) {
            maturityReached = true
            break
          }

          date = moment(date).add(1, 'days')
        }

        if (!maturityReached) {
          const lastYear = currentYear - 1
          date = moment(current).subtract(1, 'years')
          yearlyWeather = history.yearlyWeather.find(element => element.year === lastYear)

          while (!maturityReached) {
            let dailyWeather = yearlyWeather.dailyWeather.find(element => 
              moment(element.time * 1000).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
            )
  
            const caloricHours = CaloricHoursCalculator.computeForSingleDay(
              dailyWeather.temperatureMin,
              dailyWeather.temperatureMax,
              crop.product.temperatureTolerance,
              crop.product.temperatureOptimum
            )
            caloricHoursSum += caloricHours
            ++daysCount
            maturityReached = crop.product.maturityThreshold <= caloricHoursSum
            date = moment(date).add(1, 'days')
          }
        }

        harvest = moment(crop.cultivationDate).add(daysCount, 'days')
        crop.projectedHarvestDate = harvest.format('YYYY-MM-DD')
        await crop.save()
      }
    }

    return cropsList
  },


CropsListService.callback = ServicesFactory.createCustomService(CropsListService.getCropsList)



module.exports = CropsListService
