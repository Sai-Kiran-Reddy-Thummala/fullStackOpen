import Input from "./Input"
import Button from "./Button"

const PersonForm = ({onSubmit,newName,newNumber,handleNewName,handleNewNumber}) => {
    return (
        <div>
            <form onSubmit= {onSubmit}>
                <div>name: <Input value={newName} type="text" onChange={handleNewName}></Input></div>
                <div>number: <Input value={newNumber} type="tel" onChange={handleNewNumber}></Input></div>
                <div><Button type="submit" text="add"></Button></div>
            </form>
        </div>
    )
}

export default PersonForm