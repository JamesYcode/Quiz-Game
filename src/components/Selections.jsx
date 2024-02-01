function Selections({ dispatch }) {
  return (
    <div className='selection-container'>
      <h3
        className='animate__animated animate__zoomInDown'
        onClick={() => dispatch({ type: 'start', payload: 'HTML' })}
      >
        HTML
      </h3>
      <h3
        className='animate__animated animate__lightSpeedInLeft'
        onClick={() => dispatch({ type: 'start', payload: 'CSS' })}
      >
        CSS
      </h3>
      <h3
        className='animate__animated animate__lightSpeedInRight'
        onClick={() => dispatch({ type: 'start', payload: 'JavaScript' })}
      >
        JavaScript
      </h3>
      <h3
        className='animate__animated animate__zoomInUp'
        onClick={() => dispatch({ type: 'start', payload: 'React' })}
      >
        React.js
      </h3>
    </div>
  );
}

export default Selections;
