const Helpers = ({ used, lifeActive, canUse, onFifty, onExtra, onLife }) => (
  <div className="helpers">
    <button onClick={onFifty} disabled={!canUse || used.fifty}>
      Loại 1 đáp án
    </button>
    <button onClick={onExtra} disabled={!canUse || used.extra}>
      Thêm 15 giây
    </button>
    <button onClick={onLife} disabled={!canUse || used.life}>
      {lifeActive ? "Phao đang bật" : "Phao cứu sinh"}
    </button>
  </div>
);

export default Helpers;
