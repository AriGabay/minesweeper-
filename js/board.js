'use strict';
const BOMB = '💣';
const FLAG = '🚩';
const LIFE = '💗';
const HAPPY = '🙂';
const SAD = '😭';
const COOL = '😎';
var gCell;
var minesAroundCount;
var gBoard;
var gGame;
var gLife;
var gCell;
var gInterval;
var gLevel = { SIZE: 4, MINES: 2 };

function initGame() {
  document.querySelector('.seconds').innerText = '00';
  document.querySelector('.minutes').innerText = '00';
  clearInterval(gInterval);
  gBoard = buildBoard();
  renderBoard(gBoard);
  gLife = 3;
  renderLife();
  renderSmiley(HAPPY);
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
}

function renderBoard(board) {
  var strHTML = '<table border="1"><tbody>';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      strHTML += `<td class="cell cell-${i}-${j}"onclick="cellClicked(this,${i},${j})" 
      oncontextmenu="cellMarked(this,${i},${j})"></td>`;
    }
    strHTML += '</tr>';
  }
  strHTML += '</tbody></table>';
  var elBoard = document.querySelector('.board-container');
  elBoard.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  elBoard.innerHTML = strHTML;
}

function cellClicked(elCellClick, i, j) {
  if (gGame.shownCount === 0) {
    gInterval = startTimer();
    randomBomb(i, j);
  }
  var negs = setMinesNegsCount(elCellClick, i, j);
  if (!elCellClick.innerText) {
    gGame.shownCount++;
  } else {
    return;
  }
  //modal:
  if (gBoard[i][j].isMine) {
    //modal:
    gLife--;
    renderLife();
    if (!gLife) {
      checkGameOver();
    }
    //dom:
    elCellClick.innerText = BOMB;
    //modal
    gBoard[i][j].isShown = true;
  } else {
    //dom:
    elCellClick.innerText = negs;
    //modal:
    gBoard[i][j].isShown = true;
  }
  if (isVictory()) alert('You Win !');
}

function setMinesNegsCount(clickedCell, i, j) {
  var count = 0;
  for (var k = i - 1; k <= i + 1; k++) {
    if (k < 0 || k > gBoard.length - 1) continue;
    for (var g = j - 1; g <= j + 1; g++) {
      if (g < 0 || g > gBoard[0].length - 1) continue;
      if (k === i && g === j) continue;
      if (gBoard[k][g].isMine) {
        count++;
      }
    }
  }
  if (count === 0) {
    for (var k = i - 1; k <= i + 1; k++) {
      if (k < 0 || k > gBoard.length - 1) continue;
      for (var g = j - 1; g <= j + 1; g++) {
        if (g < 0 || g > gBoard[0].length - 1) continue;
        if (k === i && g === j) continue;
        if (gBoard[k][g].isMine) {
          count++;
        } else {
          var elNeg = document.querySelector(`.cell-${k}-${g}`);
          expandShown(gBoard, elNeg, k, g);
        }
      }
    }
  }
  gCell.minesAroundCount = count;
  return count;
}

function renderLife() {
  var StrHtml = '';
  var elLife = document.querySelector('.life');
  for (var i = 0; i < gLife; i++) {
    StrHtml += LIFE;
  }
  elLife.innerText = '';
  elLife.innerText = StrHtml;
}

function checkGameOver() {
  renderSmiley(SAD);
  stopTimer(gInterval);
  alert('Game Over !');
  var answer = confirm('Restart?');
  if (answer) initGame();
}

function cellMarked(elCell, i, j) {
  if (elCell.innerText === FLAG) {
    gBoard[i][j].isMarked = false;
    gGame.markedCount--;
    elCell.innerText = '';
  } else {
    //update model:
    gBoard[i][j].isMarked = true;
    gGame.markedCount++;
    // update DOM:
    elCell.innerText = FLAG;
  }
  if (isVictory()) alert('You Win!');
}

function isVictory() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) return false;
      if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {
        if (gLife > 0) continue;
      }
      if (gBoard[i][j].isMarked && !gBoard[i][j].isMine) return false;
      if (!gBoard[i][j].isMarked && gBoard[i][j].isMine) return false;
    }
  }
  renderSmiley(COOL);
  stopTimer(gInterval);
  return true;
}

function expandShown(board, negs, i, j) {
  var count = 0;
  for (var k = i - 1; k <= i + 1; k++) {
    if (k < 0 || k > board.length - 1) continue;
    for (var g = j - 1; g <= j + 1; g++) {
      if (g < 0 || g > board[0].length - 1) continue;
      if (k === i && g === j) continue;
      if (gBoard[k][g].isMine) {
        count++;
      }
    }
  }
  negs.minesAroundCount = count;
  negs.innerText = count;
  gBoard[i][j].minesAroundCount = count;
  gBoard[i][j].isShown = true;
}

function renderSmiley(smiley) {
  var elSmiley = document.querySelector('.smiley');
  elSmiley.innerText = smiley;
}
