import Options from './Options';

function Question({ question, answer, dispatch }) {
  return (
    <div className='question'>
      <h4>{question.question}</h4>
      <Options answer={answer} dispatch={dispatch} question={question} />
    </div>
  );
}

export default Question;
