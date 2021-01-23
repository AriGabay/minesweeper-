'use strict';
const BOMB = '💣';
const FLAG = '🚩';
const LIFE = '💗';
const HAPPY = '🙂';
const SAD = '😭';
const COOL = '😎';
const HINT = '💡';
var gCell;
var minesAroundCount;
var gBoard;
var gGame;
var gLife;
var gSafeClick;
var gHints;
var gCell;
var gInterval;
var gLevel = { SIZE: 4, MINES: 2 };
var gScore;

function initGame() {
  document.querySelector('.seconds').innerText = '00';
  document.querySelector('.minutes').innerText = '00';
  clearInterval(gInterval);
  gBoard = buildBoard();
  renderBoard(gBoard);
  gLife = 3;
  gHints = 3;
  gSafeClick = 3;
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

function checkCell() {
  gHints--;
  if (gHints < 0) return alert('Hints:0');
  renderHints();
  while (!isMark && !isMine && !isShown) {
    var i = getRandomInt(0, gBoard[0].length);
    var j = getRandomInt(0, gBoard[0].length);
    var isShown = gBoard[i][j].isShown;
    console.log('isShown:', isShown);
    var isMine = gBoard[i][j].isMine;
    console.log('isMine:', isMine);
    var isMark = gBoard[i][j].isMarked;
    console.log('isMark:', isMark);
    console.log('i, j:', i, j);
    if (!isMark && !isMine && !isShown) {
      SelectCell(i, j);
      gBoard[i][j].isShown = false;
      gBoard[i][j].isMine = false;
      gBoard[i][j].isMarked = false;
      return;
    }
  }
}

function SelectCell(i, j) {
  console.log('i, j:', i, j);
  var count = 0;
  var elCell = document.querySelector(`.cell-${i}-${j}`);
  for (var k = i - 1; k <= i + 1; k++) {
    if (k < 0 || k > gBoard.length - 1) continue;
    for (var g = j - 1; g <= j + 1; g++) {
      if (g < 0 || g > gBoard[0].length - 1) continue;
      if (gBoard[k][g].isMine) {
        count++;
      } else {
        var elNeg = document.querySelector(`.cell-${k}-${g}`);
        console.log('elNeg:', elNeg);
        expandShown(gBoard, elNeg, k, g);
        diseableCell(k, g);
      }
    }
  }
  gCell.minesAroundCount = count;
  return count;
}

function diseableCell(k, g) {
  //update modal:
  gBoard[k][g].isShown = false;
  gBoard[k][g].isMine = false;
  gBoard[k][g].isMarked = false;
  //update dom:
  var elNeg = document.querySelector(`.cell-${k}-${g}`);
  setTimeout(() => {
    elNeg.innerText = '';
  }, 1000);
}

function safeClick() {
  if (gSafeClick === 0) return document.querySelector('.safe-click-count').innerText=0;
  renderSafeClick();
  gSafeClick--;
  while (!isMark && !isMine && !isShown) {
    var randI = getRandomInt(0, gBoard[0].length);
    console.log('randI:', randI);
    var randJ = getRandomInt(0, gBoard[0].length);
    console.log('randJ:', randJ);
    var isMark = gBoard[randI][randJ].isMarked;
    console.log('isMark:', isMark);
    var isMine = gBoard[randI][randJ].isMine;
    console.log('isMine:', isMine);
    var isShown = gBoard[randI][randJ].isShown;
    console.log('isShown:', isShown);
    if (!isMark && !isMine && !isShown) {
      var elCell = document.querySelector(`.cell-${randI}-${randJ}`);
      elCell.classList.add('cell-pink');
      diseableClassCell(randI, randJ);
      return;
    } else {
      continue;
    }
  }
}

function diseableClassCell(k, g) {
  //update modal:
  gBoard[k][g].isShown = false;
  //update dom:
  var elNeg = document.querySelector(`.cell-${k}-${g}`);
  setTimeout(() => {
    elNeg.classList.remove('cell-pink');
  }, 1000);
}

function renderSafeClick() {
  var elSafeClick = (document.querySelector('.safe-click-count').innerText = gSafeClick-1);
  console.log('elSafeClick:', elSafeClick);
}
