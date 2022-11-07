import React from 'react'

function ClientList(props) {
  const clients = props.clients

  const clientList = clients.map(client => <li
      key={client.ClientId}
      onClick={() => props.selectClient(client.Name)}
      className={props.selectedClient === client.Name ? 'selectedClient' : ''}
    >
    {client.Name}
    </li>)

  return <ul className="client-list">{clientList}</ul>
}

export default ClientList