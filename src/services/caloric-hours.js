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
    let reachedMaturity = false
    while (!reachedMaturity) {
      weather = dailyWeather.find(day => day.time === current.unix())
      if (weather && weather.temperatureMin && weather.temperatureMax) {
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
    }
    return projection
  }
}


module.exports = CaloricHoursCalculator
