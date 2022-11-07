function MonthlyReport(props) {
  const today = new Date()
  const streaksThisMonth = Object.keys(props.streaks).filter(streakDate => {
    return streakDate.indexOf(today.getFullYear() + '-' + (today.getMonth() + 1)) === 0
  })
  const longestStreak = streaksThisMonth.length ? 
    streaksThisMonth.reduce((longestStreak, streak) => Math.min(longestStreak, props.streaks[streak]), +Infinity)
    : 0
  return <div>
    The Most Pizzas eaten in a day this month is: {props.maxConsumption}
    <br />
    The Biggest streak achieved this month is: {longestStreak} 
  </div>
}

export default MonthlyReport