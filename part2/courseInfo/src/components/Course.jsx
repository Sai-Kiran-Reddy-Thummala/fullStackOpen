const Header = (props) => {
    console.log(props)
    const {name} = props
    return <h2>{name}</h2>
  }

  const Content = (props) => {
    console.log(props)
    const {parts} = props
    const displayParts = parts.map( part => {
      return <Part key= {part.id} part={part}></Part>
    })
    console.log("display parts...", displayParts)
    return (
      <>
      {displayParts}
      </>
    )
}

const Part = (props) => {
  console.log(props)
  const {part} = props
  return (
    <p>{part.name} {part.exercises}</p>
  )
}

const Total = (props) => {
  console.log(props)
  const {parts} = props
  const total = parts.map(part => part.exercises).reduce((sum,item) => sum+item,0)
  console.log("total",total)
  return (
    <p><b>total of {total} exercises</b></p>
  )
}

const Course = (props) => {
  console.log(props)
  const {course} = props
  return (
    <>
    <Header name={course.name}></Header>
    <Content parts={course.parts}></Content>
    <Total parts={course.parts}></Total>
    </>
  )
}

export default Course