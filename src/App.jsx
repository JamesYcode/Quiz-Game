import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import Selections from './components/Selections';
import Error from './components/Error';
import Progress from './components/Progress';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Finished from './components/Finished';

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
  type: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecieved':
      return {
        ...state,
        questions: action.payload,
        status: 'ready',
      };
    case 'dataFailed':
      return {
        ...state,
        status: 'error',
      };
    case 'start':
      return {
        ...state,
        status: 'active',
        type: action.payload,
      };
    case 'newAnswer':
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case 'nextQuestion':
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case 'finished':
      return {
        ...state,
        answer: null,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case 'restart':
      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        highscore: state.highscore,
      };

    default:
      throw new Error('Action unknown');
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(function () {
    async function fetchData() {
      try {
        const res = await fetch('http://localhost:8000/questions');
        const data = await res.json();
        dispatch({ type: 'dataRecieved', payload: data });
      } catch (e) {
        dispatch({ type: 'dataFailed' });
      }
    }
    fetchData();
  }, []);

  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
    type,
  } = state;

  const filteredQuestions = questions.filter(
    (question) => question.type === type
  );
  const numQuestions = filteredQuestions.length;
  const maxPossiblePoints = filteredQuestions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  return (
    <div className='app-container'>
      <div className='app'>
        {status === 'loading' && (
          <>
            <Header />
            <Loader />
          </>
        )}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <>
            <Header />
            <Selections dispatch={dispatch} />
          </>
        )}
      </div>
      {status === 'active' && (
        <>
          <Progress
            numQuestions={numQuestions}
            index={index}
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            answer={answer}
          />
          <Question
            dispatch={dispatch}
            answer={answer}
            question={filteredQuestions.at(index)}
          />
          <NextButton
            dispatch={dispatch}
            answer={answer}
            index={index}
            numQuestions={numQuestions}
          />
        </>
      )}

      {status === 'finished' && (
        <div className='finished-container'>
          <Header />
          <Finished
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
            highscore={highscore}
          />
        </div>
      )}
    </div>
  );
}

export default App;
