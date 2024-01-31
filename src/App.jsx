import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import Selections from './components/Selections';
import Error from './components/Error';
import Progress from './components/Progress';
import Question from './components/Question';

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

  console.log(filteredQuestions);

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
        </>
      )}
    </div>
  );
}

export default App;
