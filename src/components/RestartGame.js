function RestartGame({ dispatch }) {
  return (
    <button
      onClick={() => dispatch({ type: 'restart' })}
      className="btn btn-ui">
      Restart quiz
    </button>
  );
}

export default RestartGame;
