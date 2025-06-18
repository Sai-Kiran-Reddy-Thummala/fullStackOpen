const Header = ({name}) => {
  return <h2>{name}</h2>
}

const Content = ({parts}) => {
  return (
    <>
    <Part partInfo = {parts[0]}/>
    <Part partInfo = {parts[1]}/>
    <Part partInfo = {parts[2]}/>
    </>
  )
}

const Part = ({partInfo}) => {
  return <p>{partInfo.name} Exercise: {partInfo.exercises}</p>
}

const Total = ({total}) => {
  let sum = total.reduce((a,obj) => a + obj.exercises, 0);
  return <p>Total exercises: {sum}</p>;
}

const App = () => {
  const courseInfo = {
      name : 'Half Stack application development',
      parts : [
        { name : 'Fundamentals of React', exercises: 10},
        { name : 'Using props to pass data', exercises: 7},
        { name : 'State of a component', exercises: 14},
      ]
  }

  return (
    <div>
      <Header name = {courseInfo.name} />
      <Content parts = {courseInfo.parts}/>
      <Total total = {courseInfo.parts}/>
    </div>
  )
}

export default App