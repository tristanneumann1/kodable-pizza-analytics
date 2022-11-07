import React, { useState } from 'react'

function AddConsumption(props) {
  const [pizza, setPizza] = useState('');

  function submitForm (event) {
    event.preventDefault()
    if(!props.selectedClient) {
      return
    }
    props.addConsumption(pizza, props.selectedClient)
    setPizza('')
  }
  function onChange (event) {
    setPizza(event.target.value)
  }

  return <form className="add-consumption" onSubmit={submitForm}>
      <label>
        New Consumption:
        <input type="text" value={pizza} onChange={onChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
}

export default AddConsumption
