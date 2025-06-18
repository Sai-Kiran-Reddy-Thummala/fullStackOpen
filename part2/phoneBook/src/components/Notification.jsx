const Notification = ({message}) => {

    const notification = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 15,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 5,
        marginBottom: 5
}
    return (
    message  && (
      <div style={notification}>
        <br></br>
        <p>{message}</p>
      </div>
    )
  );
}

export default Notification