import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import Loader from './components/Loader';
import Selections from './components/Selections';
import Error from './components/Error';
import Progress from './components/Progress';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Finished from './components/Finished';
import Timer from './components/Timer';

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: 10,
  type: null,
};

const SECONDS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
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
      const filteredQuestionsArr = state.questions.filter(
        (question) => question.type === action.payload
      );
      return {
        ...state,
        status: 'active',
        type: action.payload,
        secondsRemaining: filteredQuestionsArr.length * SECONDS_PER_QUESTION,
      };
    case 'newAnswer':
      const filteredQuestions = state.questions.filter(
        (question) => question.type === state.type
      );
      const question = filteredQuestions.at(state.index);
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
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case 'restart':
      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        highScore: state.highScore,
        type: null,
      };
    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
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
        // ! Use this method for development purpose!
        // const res = await fetch('http://localhost:8000/questions');
        // ! Deployment method
        const res = await fetch(
          'https://quizzy-api-4o0t.onrender.com/questions'
        );
        const data = await res.json();

        dispatch({ type: 'dataReceived', payload: shuffle(data) });
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
    highScore,
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

  function shuffle(data) {
    let currentIndex = data.length,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [data[currentIndex], data[randomIndex]] = [
        data[randomIndex],
        data[currentIndex],
      ];
    }
    return data;
  }

  return (
    <div className='app-container'>
      <div className='app'>
        {status === 'loading' && (
          <>
            <Header />
            <Loader />
          </>
        )}
        {status === 'error' && (
          <>
            <Header />
            <Error />
          </>
        )}
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
          <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
        </>
      )}

      {status === 'finished' && (
        <div className='finished-container'>
          <Header />
          <Finished
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
            highScore={highScore}
          />
        </div>
      )}
    </div>
  );
}

export default App;
