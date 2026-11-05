const AnswerButton = ({ text, state, disabled, hidden, onClick }) => (
  <button
    className={`answer ${hidden ? "empty" : state}`}
    disabled={disabled || hidden}
    onClick={onClick}
  >
    {text}
  </button>
);

export default AnswerButton;
