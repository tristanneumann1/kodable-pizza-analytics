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
    console.log('inserting ', ingredient)
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
}

module.exports = router;