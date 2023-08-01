import Header from "./Header";
import Main from "./Main";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";

/**
 * @type {{
 *  questions: {
 *    question: string,
 *    options: string[],
 *    correctOption: number,
 *    points: number
 *  }[],
 *  status: (
 *  "loading"
 *  | "error"
 *  | "active"
 *  | "finished"
 *  | "ready"
 *  )
 * }}
 */
const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
};

/**
 * Reducer function that updates the state based on the given action.
 *
 * @param state {Object} - The current state object.
 * @param action {Object} - The action object.
 * @param action.type {string} - The type of action.
 * @param action.payload {*} - The payload of the action.
 * @return {Object} - The updated state object.
 *
 * @param state.questions {Array.<Object>} - An array of question objects.
 * @param state.questions.question {Object} - The question obj.
 * @param state.questions.question.points {number}
 * @param state.questions.question.currentOption {number}
 * @param state.questions.options {Array.<string>} - An array of options for the question.
 * @param state.questions.correctOption {number} - The index of the correct option.
 * @param state.questions.points {number} - The points for the question.
 * @param state.status {"loading" | "error" | "active" | "finished" | "ready"} - The status of the state.
 * @param state.index {number} - Current question index.
 * @param state.points {number} - User points.
 *
 * @return {Object} - The updated state object.
 * @param return.questions {Array} - An array of question objects.
 * @param return.status {"loading" | "error" | "active" | "finished" | "ready"} - The updated status.
 */
function reducer(state, action) {
  console.log(state, action);

  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };

    case 'dataFailed':
      return { ...state, status: 'error' };

    case 'start':
      return { ...state, status: 'active' };

    case 'newAnswer':
      const currQuestion = state.questions[state.index];
      const isCorrectQuestion = action.payload === currQuestion.correctOption;
      const newPoints = isCorrectQuestion
        ? state.points + currQuestion.points
        : state.points;

      return { ...state, answer: action.payload, points: newPoints };

    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };

    default:
      throw new Error('Action is unknown');
  }
}

export default function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (acc, curr) => acc + curr.points,
    0,
  );

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('http://localhost:8000/questions');
        const questions = await res.json();

        if (!res.ok) throw new Error('Error');

        dispatch({ type: 'dataReceived', payload: questions });
      } catch (e) {
        dispatch({ type: 'dataFailed' });
      }
    }

    loadQuestions();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />

            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />

            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
}
