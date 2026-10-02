// Shared 0–10 hand values used by the Preflop Slider quiz.
// Rows/columns run A to 2; above the diagonal is suited, below is offsuit.
(function () {
  const ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

  const scores = [
    [10,10,9,9,8,8,7,7,7,7,7,7,7],
    [9,10,9,8,8,7,5,4,4,4,4,4,1],
    [8,8,10,8,8,7,5,4,4,4,1,0,0],
    [8,6,6,9,8,7,5,4,4,0,0,0,0],
    [6,5,5,5,9,7,7,4,4,0,0,0,0],
    [4,4,4,4,4,9,7,6,3,1,0,0,0],
    [4,1,1,1,1,1,8,7,5,3,1,0,0],
    [4,0,0,0,0,0,0,8,7,3,1,0,0],
    [4,0,0,0,0,0,0,0,7,6,3,1,0],
    [4,0,0,0,0,0,0,0,0,7,5,1,0],
    [4,0,0,0,0,0,0,0,0,0,6,3,0],
    [4,0,0,0,0,0,0,0,0,0,0,5,1],
    [4,0,0,0,0,0,0,0,0,0,0,0,5]
  ];
  window.PokerData = Object.freeze({
    ranks: Object.freeze(ranks),
    scores: Object.freeze(scores.map(row => Object.freeze(row)))
  });
})();
