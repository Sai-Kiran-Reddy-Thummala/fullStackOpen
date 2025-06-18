const PersonForm = ({
    onSubmit,
    newName,
    handleNewName,
    newNumber,
    handleNewNumber
    }) => {
    return (
    <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={handleNewName}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNewNumber}></input>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>)
}

export default PersonForm