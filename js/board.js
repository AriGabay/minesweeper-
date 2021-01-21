'use strict';
const BOMB = '💣';
const FLAG = '🚩';
var gCell;
var minesAroundCount;
var gBoard;
var gLevel = { SIZE: 4, MINES: 4 };
var gGame;
var gLife;

function initGame() {
  gBoard = buildBoard();
  renderBoard(gBoard);
  gLife = 3;
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
      strHTML += `<td class="cell cell-${i}-${j}"onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMarked(this,${i},${j})"></td>`;
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
  if (gGame.shownCount === 0) randomBomb(elCellClick, i, j);

  var negs = setMinesNegsCount(elCellClick, i, j);
  if (!elCellClick.innerText) {
    gGame.shownCount++;
  }else{return;}
  if (gBoard[i][j].isMine) {
    var lifeEl=document.querySelector('.life');
    if(lifeEl.childNodes[0]){
      lifeEl.removeChild(lifeEl.childNodes[0]);
    }
    gLife--;
    if (!gLife) {
      checkGameOver();
    }

    elCellClick.innerText = BOMB;
    gBoard[i][j].isShown=true

  } else {
    elCellClick.innerText = negs;
    gBoard[i][j].isShown=true

  }
  if (isVictory()) alert('You Win !');
}

function setMinesNegsCount(elCellClick, i, j) {
  var count = 0;
  for (var k = i - 1; k <= i + 1; k++) {
    if (k < 0 || k > gBoard.length - 1) continue;
    for (var g = j - 1; g <= j + 1; g++) {
      if (g < 0 || g > gBoard[0].length - 1) continue;
      if (k === i && g === j) continue;
      expandShown(elCellClick, k, g);
      if (gBoard[k][g].isMine) {
        count++;
      }
    }
  }
  gCell.minesAroundCount = count;
  return count;
}

function checkGameOver() {
  alert('Game Over !');
}

function randomBomb(k, g) {
  for (var i = 0; i < gLevel.MINES; i++) {
    var idx1 = getRandomInt(0, gLevel.SIZE);
    var idx2 = getRandomInt(0, gLevel.SIZE);
    if (idx1 === k && idx2 === g) {
      i--;
    } else {
      gBoard[idx1][idx2].isMine = true;
    }
    console.log(idx1, idx2);
  }
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
  var sum = gGame.markedCount + gGame.shownCount;
  var allBoard = gLevel.SIZE * gLevel.SIZE;
  if (sum === allBoard) return true;
  else return false;
}

function expandShown(elCell, i, j) {
  var negs = document.querySelector(`.cell-${i}-${j}`);
  if (!gBoard[i][j].isMine) {

  }
}
