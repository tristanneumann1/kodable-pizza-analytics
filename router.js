const { DateTime } = require('luxon')

function router(app, db) {
  
  app.get('/pizzas', (req, res) => {
    db.all('SELECT * FROM pizzas', (err, pizzas) => {
      if (err) {
        console.error(err)
      }
      res.json(pizzas)
    })
  });

  app.post('/pizza', (req, res) => {
    const ingredient = req.body?.ingredient?.trim()
    if (ingredient) {
      db.run(`INSERT INTO pizzas (Ingredient) VALUES ("${ingredient}")`)
    }
    res.status(201).send('Done')
  })

  app.put('/pizza', (req, res) => {
    const currentPizza = req.body?.current
    const newPizza = req.body?.new
    if (currentPizza && newPizza) {
      db.run(`UPDATE pizzas SET Ingredient="${newPizza}" WHERE Ingredient = "${currentPizza}"`)
    }
    res.status(201).send('updated')
  })
  

  app.delete('/pizza', (req, res) => {
    const pizzaToDelete = req.body?.ingredient
    if (pizzaToDelete) {
      db.run(`DELETE from pizzas WHERE Ingredient = "${pizzaToDelete}"`)
    }
    res.status(201).send('deleted')
  })
  
  app.get('/clients', (req, res) => {
    db.all('SELECT * FROM clients', (err, clients) => {
      if (err) {
        console.error(err)
      }
      res.json(clients)
    })
  });

  app.post('/client', (req, res) => {
    const name = req.body?.name?.trim()
    if (name) {
      db.run(`INSERT INTO clients (Name) VALUES ("${name}")`)
    }
    res.status(201).send('Done')
  })

  app.put('/client', (req, res) => {
    const currentName = req.body?.current
    const newName = req.body?.new
    if (currentName && newName) {
      db.run(`UPDATE clients SET Name="${newName}" WHERE Name = "${currentName}"`)
    }
    res.status(201).send('updated')
  })
  

  app.delete('/client', (req, res) => {
    const clientToDelete = req.body?.name
    if (clientToDelete) {
      db.run(`DELETE from clients WHERE Name = "${clientToDelete}"`)
    }
    res.status(201).send('deleted')
  })

  app.get('/consumptions', (req, res) => {
    db.all(`
      SELECT co.ConsumptionId, p.Ingredient Pizza, c.Name Client, co.Date FROM consumptions co
      JOIN pizzas p ON co.Pizza = p.PizzaId 
      JOIN clients c ON co.Client = c.ClientId 
    `, (err, consumptions) => {
      if (err) {
        console.error(err)
      }
      res.json(consumptions)
    })
  })

  app.post('/consume', (req, res) => {
    const pizza = req.body?.pizza
    const client = req.body?.client
    const date = req.body?.date

    if (pizza && client && date) {
      db.serialize(() => {
        db.run(`INSERT OR IGNORE INTO pizzas(Ingredient) VALUES("${pizza}")`)
        db.run(`INSERT OR IGNORE INTO clients(Name) VALUES("${client}")`)
        db.run(`INSERT INTO consumptions(Pizza, Client, Date) VALUES(
          (SELECT PizzaId from pizzas WHERE Ingredient="${pizza}"),
          (SELECT ClientId from clients WHERE Name="${client}"),
          "${date}"
        )`)
      })
    }
    res.status(201).send('consumed')
  })

  app.get('/streaks', (req, res) => {
    db.all('SELECT Date from consumptions ORDER BY Date ASC', (err, consumptions) => {
      if (err) {
        res.status(400).send(err)
        return
      }
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
      res.status(200).json(streaks)
    })
  })

  app.get('/maxConsumption', (req, res) => {
    let month = req.query?.date
    if (!month) {
      res.status(400).send('required month not provided')
      return
    }
    db.all(`SELECT Date FROM consumptions WHERE Date LIKE "${month}%" ORDER BY Date ASC`, (err, consumptionDates) => {
      const consumptions = consumptionDates.map(consumption => consumption.Date);
      if (err) {
        console.error(err)
      }
      let maxOfTheMonth = 0;
      for (let i = 0; i < consumptions.length; i++) {
        let dailyTotal = 1
        while(isSameDay(consumptions[i+1], consumptions[i]) && i < consumptions.length) {
          i++
          dailyTotal++
        }
        maxOfTheMonth = Math.max(maxOfTheMonth, dailyTotal)
      }
      res.status(200).json(maxOfTheMonth)
    })
  })
}

function isOneDayLaterExceptSunday(oldDate, newDate) {
  return DateTime.fromISO(newDate).diff(DateTime.fromISO(oldDate), 'days').days === 1
  || (DateTime.fromISO(newDate).diff(DateTime.fromISO(oldDate), 'days').days === 2
    && DateTime.fromISO(oldDate).weekday === 6)
}

function isSameDay(date1, date2) {
  return DateTime.fromISO(date1).startOf('day').equals(DateTime.fromISO(date2).startOf('day'))
}


module.exports = router;