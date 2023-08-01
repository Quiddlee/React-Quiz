import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);

  useEffect(() => {
    const intervalId = setInterval(() => dispatch({ type: 'tick' }), 1000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div className="timer">
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default Timer;
