function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      gCell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
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
  }
  if (level === 'Meduim') {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
  }
  if (level === 'Hard') {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
  }
  renderLife();
  initGame();
}



function startTimer() {
  var sec = 0;
  var interVal01 = setInterval(function () {
    document.querySelector('.seconds').innerHTML = pad(++sec % 60);
    document.querySelector('.minutes').innerHTML = pad(parseInt(sec / 60, 10));
  }, 1000);
  function pad(val) {
    return val < 9 ? '0' + val :val;
  }
  return interVal01;
}

function stopTimer(interVal01) {
  clearInterval(interVal01);
}

function randomBomb(k, g) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var idx1 = getRandomInt(0, gLevel.SIZE);
    var idx2 = getRandomInt(0, gLevel.SIZE);
    if (idx1 === k && idx2 === g) {
      i--;
      continue;
    } else {
      gBoard[idx1][idx2].isMine = true;
    }
  }
}

function renderHints() {
  var strHtml = '';
  var elHint = document.querySelector('.hints');
  for (var i = 0; i < gHints; i++) {
    strHtml += HINT;
  }
  elHint.innerText = '';
  elHint.innerText = strHtml;
}
