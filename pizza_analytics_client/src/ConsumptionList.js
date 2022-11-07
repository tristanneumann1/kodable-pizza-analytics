function ConsumptionList(props) {
  const consumptionElements = props.consumptions.filter(
    consumption => consumption.Client === props.selectedClient
  ).map(
    consumption => <li key={consumption.ConsumptionId} >{consumption.Client} consumed {consumption.Pizza} on {consumption.Date}</li>
  );
  return <ul>{consumptionElements}</ul>
}

export default ConsumptionList