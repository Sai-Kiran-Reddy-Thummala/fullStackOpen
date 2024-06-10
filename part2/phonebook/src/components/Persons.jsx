const Persons = ({ person,onClick}) => {
  return (
    <div>
       <p>{person.name} {person.number} <button onClick={onClick}>delete</button> </p> 
    </div>
  );
};
export default Persons