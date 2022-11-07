import React, { useState } from 'react'

function AddClient(props) {
  const [client, setClient] = useState('');

  function submitForm (event) {
    event.preventDefault()
    props.addClient(client)
    setClient('')
  }
  function onChange (event) {
    setClient(event.target.value)
  }

  return <form onSubmit={submitForm}>
      <label>
        New Customer:
        <input type="text" value={client} onChange={onChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
}

export default AddClient
