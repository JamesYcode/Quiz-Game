function NextButton({ dispatch, answer, index, numQuestions }) {
  if (answer === null) return null;

  if (index < numQuestions - 1) {
    return (
      <div className='next-container'>
        <button
          onClick={() => dispatch({ type: 'nextQuestion' })}
          className='btn btn-ui'
        >
          Next
        </button>
      </div>
    );
  } else if (index === numQuestions - 1) {
    return (
      <div className='next-container'>
        <button
          onClick={() => dispatch({ type: 'finished' })}
          className='btn btn-ui'
        >
          Finish
        </button>
      </div>
    );
  }
}

export default NextButton;
