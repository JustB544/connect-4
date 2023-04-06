class Game {
  WIDTH;
  HEIGHT;
  currPlayer;
  board;
  constructor(height, width) {
    this.WIDTH = width;
    this.HEIGHT = height;
    this.currPlayer = 1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
  }

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = (this.currPlayer === 1) ? color1 : color2;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    if (evt.target.id === "column-top") {
      return;
    }
    const x = parseInt(evt.target.id);

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      setTimeout(this.endGame, 1, `Player ${this.currPlayer} won!`);
      return;
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      setTimeout(this.endGame, 1, 'Tie!');
      return;
    }

    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  checkForWin() {
    const _win = (cells) => cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer
    );

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

let game;

const button = document.querySelector("#head button");
const board = document.querySelector("#board");
const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");

let color1 = "red";
let color2 = "blue";

button.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(e);

  if (game !== undefined) {
    board.innerHTML = "";
    delete game;
  }
  if (input1 !== "") {
    color1 = input1.value;
  }
  if (input2 !== "") {
    color2 = input2.value;
  }
  game = new Game(6, 7);
})