import React from 'react'

function ClientList(props) {
  const clients = props.clients

  const clientList = clients.map(client => <li key={client.ClientId} onClick={(event) => props.selectClient(client.Name)}>{client.Name}</li>)

  return <ul>{clientList}</ul>
}

export default ClientList