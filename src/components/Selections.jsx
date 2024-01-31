function Selections({ dispatch }) {
  return (
    <div className='selection-container'>
      <h3 onClick={() => dispatch({ type: 'start', payload: 'HTML' })}>HTML</h3>
      <h3 onClick={() => dispatch({ type: 'start', payload: 'CSS' })}>CSS</h3>
      <h3 onClick={() => dispatch({ type: 'start', payload: 'JavaScript' })}>
        JavaScript
      </h3>
      <h3 onClick={() => dispatch({ type: 'start', payload: 'React' })}>
        React.js
      </h3>
    </div>
  );
}

export default Selections;
