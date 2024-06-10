import Input from "./Input"
const Filter = ({filter,handleFilter}) => {
    return (
      <div>
        filter shown with : <input type="text" value={filter} onChange={handleFilter}></input>
      </div>
    )
  }

  export default Filter