import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining, shuffle, filteredQuestions }) {
  const min = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  useEffect(
    function () {
      const timer = setInterval(() => {
        dispatch({ type: 'tick' });
      }, 1000);
      return () => clearInterval(timer);
    },
    [dispatch, secondsRemaining]
  );
  return (
    <div className='timer-container'>
      <div
        onClick={() =>
          dispatch({ type: 'restart', payload: shuffle(filteredQuestions) })
        }
        role='button'
        className='timer go-back'
      >
        Go Back
      </div>
      <div className='timer countdown'>
        {min < 10 && '0'}
        {min}:{seconds < 10 && '0'}
        {seconds}
      </div>
    </div>
  );
}

export default Timer;
