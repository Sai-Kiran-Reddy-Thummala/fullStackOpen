const Number = ({person,deletePerson}) => {
  return <li>{person.name} {person.number}
  <> </><button onClick={deletePerson}>Delete</button></li>
}

export default Number