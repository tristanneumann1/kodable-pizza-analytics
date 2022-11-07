import './App.css';
import React, { useState, useEffect } from 'react';
import { getClients, getConsumptions, getStreaks, getMaxConsumption, addNewClient, addNewConsumption } from './store';
import ClientList from './ClientList';
import AddClient from './AddClient';
import ConsumptionList from './ConsumptionList';
import AddConsumption from './AddConsumption';
import MonthlyReport from './MonthlyReport';

function App() {
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientsState, setClients] = useState([])
  const [consumptionsState, setConsumptions] = useState([])
  const [streaksState, setStreaks] = useState([])
  const [maxConsumptionState, setMaxConsumption] = useState(0)

  function getMonthlyStats () {
    // get streaks
    getStreaks().then(streaks => {
      setStreaks(streaks)
    })
  
    // get max of current month
    // get current month
    const today = new Date()
    const currentMonth = today.getFullYear() + '-' + (today.getMonth() + 1)
    getMaxConsumption(currentMonth).then(maxConsumption => {
      setMaxConsumption(maxConsumption)
    })
  }

  useEffect(() => {
    // get all clients and all consumptions
    getClients().then((clients) => {
      setClients(clients)
    })
    getConsumptions().then(consumptions => {
      setConsumptions(consumptions)
    })
    getMonthlyStats()
  }, [])

  function addClient(clientName) {
    addNewClient(clientName).then(() => {
      setClients([...clientsState, {
        ClientId: clientsState[clientsState.length - 1].ClientId + 1,
        Name: clientName
      }])
    })
  }

  function addConsumption(pizza, client) {
    addNewConsumption(pizza, client).then(() => {
      setConsumptions([...consumptionsState, {
        ConsumptionId: consumptionsState[consumptionsState.length - 1].ConsumptionId + 1,
        Pizza: pizza,
        Client: client,
        Date: (new Date()).toISOString()
      }])

      getMonthlyStats()
    })
  }

  return (
    <div className="App">
      <ClientList clients={clientsState} selectClient={setSelectedClient.bind(this)} selectedClient={selectedClient}/>
      <AddClient addClient={addClient.bind(this)} />
      <ConsumptionList consumptions={consumptionsState} selectedClient={selectedClient}/>
      <AddConsumption addConsumption={addConsumption.bind(this)} selectedClient={selectedClient} />
      <MonthlyReport streaks={streaksState} maxConsumption={maxConsumptionState}/>
    </div>
  );
}

export default App;
