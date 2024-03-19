function Finished({ points, maxPossiblePoints, dispatch, highScore }) {
  const percentage = Math.ceil((points / maxPossiblePoints) * 100);
  let result;
  if (percentage === 100) result = '🥇';
  if (percentage >= 80 && percentage < 100) result = '🎊';
  if (percentage >= 50 && percentage < 80) result = '👍';
  if (percentage > 0 && percentage < 50) result = '🤔';
  if (percentage === 0) result = '💩';

  return (
    <div className='result-container animate__animated animate__zoomInUp'>
      <p className='result'>
        ({result}) You scored {points} out of {maxPossiblePoints} ({percentage}
        %)
      </p>
      <p className='highScore'>(highScore: {highScore} points)</p>
      <button
        onClick={() => dispatch({ type: 'restart' })}
        className='btn btn-ui'
      >
        Restart
      </button>
    </div>
  );
}

export default Finished;
