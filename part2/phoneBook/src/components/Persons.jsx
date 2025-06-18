import Number from "./Number"

const Persons = ({persons, handleDelete}) => {
    return (
        <ul>
            {persons.map(person => <Number key={person.id} person={person} deletePerson={() => handleDelete(person.id)}></Number>)}
        </ul>
    )
}

export default Persons