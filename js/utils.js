function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      gCell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
      };
      board[i][j] = gCell;
    }
  }
  return board;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function level(elButton) {
  var level = elButton.innerHTML;
  if (level === 'Esay') {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    console.log(gLevel);
  }
  if (level === 'Meduim') {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    console.log(gLevel);
  }
  if (level === 'Hard') {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    console.log(gLevel);
  }

  gBoard = buildBoard();
  renderBoard(gBoard);
}
