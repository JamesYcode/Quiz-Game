import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
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
      <div className='timer'>
        {min < 10 && '0'}
        {min}:{seconds < 10 && '0'}
        {seconds}
      </div>
    </div>
  );
}

export default Timer;
