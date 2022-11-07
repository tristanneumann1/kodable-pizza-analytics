const { DateTime } = require('luxon')

// function assumes consumption dates are already filtered and ordered properly
function findMaxConsumption(consumptionDates) {
  const consumptions = consumptionDates.map(consumption => consumption.Date);
  let maxOfTheMonth = 0
  let maxConsumptionDay = ''
  for (let i = 0; i < consumptions.length; i++) {
    let dailyTotal = 1
    while(isSameDay(consumptions[i+1], consumptions[i]) && i < consumptions.length) {
      i++
      dailyTotal++
    }
    if (dailyTotal > maxOfTheMonth) {
      maxOfTheMonth = dailyTotal
      maxConsumptionDay = consumptions[i]
    }
  }
  return { date: maxConsumptionDay, max: maxOfTheMonth }
}

function findStreaks(consumptions) {
  const consumptionDates = consumptions.map(consumption => consumption.Date);
  const streaks = {}
  let currentStreak = 0
  let latestPizzaSales = 0
  let previousDate = null
  for (let i = 0; i < consumptionDates.length; i++) {
    let currentPizzaSales = 0
    while(isSameDay(consumptionDates[i+1], consumptionDates[i]) && i < consumptionDates.length) {
      i++
      currentPizzaSales++
    }

    if (currentPizzaSales > latestPizzaSales && (isOneDayLaterExceptSunday(previousDate, consumptionDates[i]) || previousDate === null)) {
      currentStreak++
    } else {
      currentStreak = 1
    }

    streaks[consumptionDates[i]] = currentStreak
    latestPizzaSales = currentPizzaSales
    previousDate = consumptionDates[i]
  }
  return streaks
}

function isOneDayLaterExceptSunday(oldDate, newDate) {
  return DateTime.fromISO(newDate).diff(DateTime.fromISO(oldDate), 'days').days === 1
  || (DateTime.fromISO(newDate).diff(DateTime.fromISO(oldDate), 'days').days === 2
    && DateTime.fromISO(oldDate).weekday === 6)
}

function isSameDay(date1, date2) {
  return DateTime.fromISO(date1).startOf('day').equals(DateTime.fromISO(date2).startOf('day'))
}

module.exports = { findMaxConsumption, findStreaks }