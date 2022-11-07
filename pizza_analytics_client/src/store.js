function getClients() {
  return fetch('http://localhost:3030/clients')
  .then(res => res.json())
}

function getConsumptions() {
  return fetch('http://localhost:3030/consumptions')
  .then(res => res.json())
}

function getStreaks() {
  return fetch('http://localhost:3030/streaks')
  .then(res => res.json())
}

function getMaxConsumption(date = '') {
  return fetch('http://localhost:3030/maxConsumption?date=' + date)
  .then(res => res.json())
}

function addNewClient(clientName) {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: clientName })
  }
  return fetch('http://localhost:3030/client', options)
}

function addNewConsumption(pizza, client) {
  const headers = new Headers()
  headers.append("Content-Type", "application/json")
  const date = (new Date()).toISOString()
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify({ pizza, client, date })
  }
  return fetch('http://localhost:3030/consume', options)
}


export { getClients, getConsumptions, getStreaks, getMaxConsumption, addNewClient, addNewConsumption }