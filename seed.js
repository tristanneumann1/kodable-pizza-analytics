const { parse } = require('csv-parse')
const fs = require('fs')

function seedDatabase(db) {
  fs.readFile('./data.csv', (err, data) => {
    if (err) {
      console.error('error reading data file', err)
      return
    }
      
    parse(data, {columns: false, trim: true}, function(err, rows) {
      if (err) {
        console.error('Error parsing file, ', err)
        return
      }

      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS pizzas (
            PizzaId INTEGER PRIMARY KEY,
            Ingredient TEXT);
        `)
        db.run(`
          CREATE TABLE IF NOT EXISTS clients (
            ClientId INTEGER PRIMARY KEY,
            Name TEXT);
        `)
        db.run(`
          CREATE TABLE IF NOT EXISTS transactions (
            TransactionId INTEGER PRIMARY KEY, 
            Pizza INTEGER,
            Client INTEGER,
            Date TEXT,
            FOREIGN KEY(Pizza) REFERENCES pizzas(PizzaId) ON DELETE CASCADE, 
            FOREIGN KEY(Client) REFERENCES clients(ClientId) ON DELETE CASCADE
          );`
        )

        const pizzas = new Set()
        const clients = new Set()
        const clientInserts = db.prepare('INSERT INTO clients (Name) VALUES (?)')
        const pizzaInserts = db.prepare('INSERT INTO pizzas (Ingredient) VALUES (?)')
        const transactionInserts = db.prepare(`INSERT INTO transactions (Client, Pizza, Date) VALUES (
        (SELECT ClientId from clients WHERE Name=?),
        (SELECT PizzaId from pizzas WHERE Ingredient=?),
        ?
        );`)
        rows.forEach(transaction => {
          if (!clients.has(transaction[0])) {
            clientInserts.run(transaction[0])
          }
          
          if (!pizzas.has(transaction[1])) {
            pizzaInserts.run(transaction[1])
          }
          
          transactionInserts.run(transaction[0], transaction[1], transaction[2])
          
          clients.add(transaction[0])
          pizzas.add(transaction[1])
        });
        
        clientInserts.finalize()
        pizzaInserts.finalize()
        transactionInserts.finalize()
      })
    })
  })
}

module.exports = seedDatabase