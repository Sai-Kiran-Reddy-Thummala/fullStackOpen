const Course = ({courses}) => {
  return (
      courses.map((course) => {
          return (
           <div key={course.id}> // when using map, give a key to the parent element
          <Header course={course}></Header>
          <Content parts={course.parts}></Content>
          <Total parts={course.parts}></Total>
          </div> 
          )  
      } ))
    }
export default Course

const Header = ({course}) => <h1>{course.name}</h1>

const Content = ({parts}) => {
  return <ul>
    {parts.map(part => <Part key={part.id} part={part}></Part>)} // when using map, give a key to the parent element
  </ul>
}

const Part = ({part}) => <li>{part.name} {part.exercises}</li>

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => {return sum + part.exercises},0)
  return <p>Total exercises {total}</p>
}