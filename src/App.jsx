import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import Selections from './components/Selections';
import Error from './components/Error';

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: 10,
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
        console.log(data);
      } catch (e) {
        console.log(e);
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
  } = state;

  return (
    <div className='app'>
      <Header />
      {status === 'loading' && <Loader />}
      {status === 'error' && <Error />}
      {status === 'ready' && (
        <>
          <Selections />
        </>
      )}
    </div>
  );
}

export default App;
