const CaloricHoursCalculator = {

  computeForSingleDay: function(min, max, tolerance, optimal) {
    let caloricHours = 0
    if (tolerance.max < max) {
      caloricHours = 0
    } else if (optimal.max < max) {
      caloricHours = 0.5 * (optimal.min - max - optimal.max + min) - tolerance.min
    } else if (optimal.min < max) {
      caloricHours = 0.5 * (optimal.min + min) - tolerance.min
    } else {
      const result = 0.5 * (max + min) - tolerance.min
      caloricHours = (result < 0) ? 0 : result
    }
    return caloricHours
  },
  
  
  computeAccumulationUntilMaturity: function(product, start, dailyWeather) {
    const projection = {
      caloricHoursSum: 0,
      daysForMaturity: 0
    }
    let current = start
    const startingYear = current.year()
    let reachedMaturity = false
    let debugCount = 0
    while (!reachedMaturity) {
      ++debugCount
      if (debugCount > 365) {
        throw new Error('Debug failed!!!!')
      }
      weather = dailyWeather.find(day => day.time === current.unix())
      console.debug(weather)
      if (weather && weather.temperatureMin && weather.temperatureMax) {
        console.debug(`Computing for ${current.format('YYYY-MM-DD')}`)
        const caloricHours = CaloricHoursCalculator.computeForSingleDay(
          weather.temperatureMin, 
          weather.temperatureMax, 
          product.temperatureTolerance, 
          product.temperatureOptimum
        )
        projection.caloricHoursSum += caloricHours
        projection.daysForMaturity++
      }
      current = current.add(1, 'days')
      reachedMaturity = product.maturityThreshold <= projection.caloricHoursSum

      // si se nos acabaron los datos historicos, regresa al inicio del año
      if (current.year() > startingYear) {
        current.subtract(1, 'year')
      }
    }
    return projection
  }
}


module.exports = CaloricHoursCalculator
