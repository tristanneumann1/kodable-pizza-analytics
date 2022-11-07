const { findStreaks, findMaxConsumption } = require("../helpers")

function createConsumptions(date, quantity) {
  const consumptions = []
  for (let i = 0; i < quantity; i++) {
    consumptions.push({ Date: date })
  }
  return consumptions
}

describe('helpers', () => {
  it('finds max monthly pizza consumptions', () => {
    const maxConsumption = findMaxConsumption([
      ...createConsumptions('2022-01-03', 2),
      ...createConsumptions('2022-01-05', 5),
      ...createConsumptions('2022-01-07', 8),
      ...createConsumptions('2022-01-09', 1),
      
    ])
    expect(maxConsumption).toEqual({date: '2022-01-07', max: 8})
  })
  
  it('finds pizza consumption streaks', () => {
    const consumptionsWithBigStreak = findStreaks([
      ...createConsumptions('2022-01-03', 1),
      ...createConsumptions('2022-01-04', 2),
      ...createConsumptions('2022-01-05', 3),
      ...createConsumptions('2022-01-06', 4)
    ])
    const consumptionsWithoutStreak = findStreaks([
      ...createConsumptions('2022-01-03', 1),
      ...createConsumptions('2022-01-05', 2),
      ...createConsumptions('2022-01-07', 3)
    ])
    const consumptionsRunningOverSunday = findStreaks([
      ...createConsumptions('2022-01-01', 1),
      ...createConsumptions('2022-01-03', 2),
      ...createConsumptions('2022-01-04', 3)
    ])

    expect(consumptionsWithBigStreak['2022-01-03']).toBe(1)
    expect(consumptionsWithBigStreak['2022-01-04']).toBe(2)
    expect(consumptionsWithBigStreak['2022-01-05']).toBe(3)
    expect(consumptionsWithBigStreak['2022-01-06']).toBe(4)

    expect(consumptionsWithoutStreak['2022-01-03']).toBe(1)
    expect(consumptionsWithoutStreak['2022-01-05']).toBe(1)
    expect(consumptionsWithoutStreak['2022-01-07']).toBe(1)

    expect(consumptionsRunningOverSunday['2022-01-01']).toBe(1)
    expect(consumptionsRunningOverSunday['2022-01-03']).toBe(2)
    expect(consumptionsRunningOverSunday['2022-01-04']).toBe(3)
  })
})