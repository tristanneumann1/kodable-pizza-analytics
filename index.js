const sqlite3 = require('sqlite3').verbose()
const express = require('express')

const app = express()
const port = 3000
const db = new sqlite3.Database('./db/pizza-analytics.db')

function initialiseDb () {
  db.run('CREATE TABLE IF NOT EXISTS pizzas (PizzaId INTEGER PRIMARY KEY, Ingredient TEXT)');
  db.run('INSERT INTO pizzas (ingredient) VALUES ("cheese")')
}
initialiseDb();

app.get('/pizzas', (req, res) => {
  db.all('SELECT * FROM pizzas', (err, pizzas) => {
    if (err) {
      console.error(err)
    }
    res.json(pizzas)
  })
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
});