const { findMaxConsumption, findStreaks } = require('./helpers');

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
        )`, (err) => {
          if (err) {
            res.status(500).send(err)
          }
          res.status(201).send('consumed')
        })
      })
      return
    }
    res.status(400).send('missing parameters')
  })

  app.get('/streaks', (req, res) => {
    db.all('SELECT Date from consumptions ORDER BY Date ASC', (err, consumptions = []) => {
      if (err) {
        res.status(400).send(err)
        return
      }
      
      const streaks = findStreaks(consumptions)

      res.status(200).json(streaks)
    })
  })

  app.get('/maxConsumption', (req, res) => {
    let month = req.query?.date
    if (!month) {
      res.status(400).send('required month not provided')
      return
    }
    db.all(`SELECT Date FROM consumptions WHERE Date LIKE "${month}%" ORDER BY Date ASC`, (err, consumptionDates = []) => {
      if (err) {
        console.error(err)
        res.status(500).send(err)
        return
      }
      
      const maxConsumption = findMaxConsumption(consumptionDates);

      res.status(200).json(maxConsumption)
    })
  })
}

module.exports = router;