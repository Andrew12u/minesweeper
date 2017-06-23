import React, { Component } from 'react';
import './css/App.css';
import Board from './Board';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      numRows:0,
      numCols:0,
      numMines:0,
      squares:{},
      mines:{},
      indicatingSquares:{},
      triggeringSquares:{
        count:0
      }
    }
    //this.mines = [];
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value
    });
  }

  /*
   * Gets a new blank row x column board
   */
  getBoard(){
    let numRows = this.state.numRows;
    let numCols = this.state.numCols;
    let newBoard = {};
    let count = 0;
    for(let r=0; r<numRows; r++){
      for(let c=0; c<numCols; c++){
        newBoard["square-"+ r + "-" + c] = {
          row: r,
          col: c,
          pressed: false,
          isReally: "",
          condition: "unknown"
        }
        count++;
      }
    }
    newBoard["count"] = count;
    return newBoard;
  }

  /*
   * Checks to see if number of mines is not blank/empty
   * and if the number of mines has changed.
   * game will *not* reset if the number of mines isn't different
   */
  gameNeedsReset(){
    if((!this.state.numMines) || (this.state.mines["count"] == this.state.numMines)){
      return false; //game doesn't need to be reset
    }
    return true; //games needs to be reset
  }

  //returns a random number between min and max (inclusive)
  getRandomBetweenIntegers(min, max){
    let minInt = Math.ceil(min);
    let maxInt = Math.floor(max);
    return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
  }

  mineAtLocation(row, col, mines){
    if(mines["mine-" + row + "-" + col]) return true;
    return false;
  }


  getMines(){
    let minRows = 0, maxRows = this.state.numRows;
    let minCols = 0, maxCols = this.state.numCols;
    let row = 0,     col = 0;

    let mines = {};
    let count = 0;

    for(let m=0; m<this.state.numMines; m++){
      row = this.getRandomBetweenIntegers(minRows, maxRows-1); //-1 since inclusive
      col = this.getRandomBetweenIntegers(minCols, maxCols-1); //-1 since inclusive

      if(m == 0){ //first mine, there will be no dupes
        mines["mine-" + row + "-" + col] = {
          row: row,
          col: col
        }
        count++;
        mines["count"] = count;
        continue;
      }
      while(this.mineAtLocation(row, col, mines)){ //dupe encountered need new values
        row = this.getRandomBetweenIntegers(minRows, maxRows-1);
        col = this.getRandomBetweenIntegers(minCols, maxCols-1);
      }

      mines["mine-" + row + "-" + col] = {
        row: row,
        col: col
      }

      count++;
      mines["count"] = count;
    }

    return mines;
  }

  /********* Getting indicatingSquares with # nearby mines *********
   * procedure:
   * 1. get bordering squares (careful to stay within bounds of board)
   * 2. get boardering squares that aren't mines (e.g. indicatingSquares)
   * 3. for each indicatingSquare, get # of nearby mines
   */
  isWithinBounds(row, col){
    //square is out of bounds: top, left, top-left, bottom-left
    if((row === -1) || (col === -1)) return false;
    //square is out of bounds: bottom, right, bottom-right, top-right
    if((row == this.state.numRows) || (col == this.state.numCols)) return false;
    //square should be within bounds.
    return true;
  }
  getBorderSquares(row, col){
    let realBoaderSquares = [];
    let possBoarderSquares = [
      {row: row-1, col: col},
      {row: row+1, col: col},
      {row: row, col: col-1},
      {row: row, col: col+1},
      {row: row-1, col: col-1},
      {row: row-1, col: col+1},
      {row: row+1, col: col-1},
      {row: row+1, col: col+1}
    ];
    for(let b=0; b<possBoarderSquares.length; b++){
      if(this.isWithinBounds(possBoarderSquares[b].row, possBoarderSquares[b].col))
        realBoaderSquares.push(possBoarderSquares[b]);
    }
    return realBoaderSquares;
  }
  /*
   * returns an array of boarder squares which are indicating  squares
   * surrounding one mine. That is, returns squares denoting # of nearby mines.
   * @param boarderSquares an array of {row:row, col:col} objs surrounding mine
   */
  getIndicatingSquares(borderSquares, mines){
    let indicatingSquares = [];
    for(let b=0; b<borderSquares.length; b++){
      if(!this.mineAtLocation(borderSquares[b].row, borderSquares[b].col, mines))
        indicatingSquares.push(borderSquares[b]);
    }
    return indicatingSquares;
  }

  getCountOfNearbyMines(row, col, mines){
    let mineCount = 0;
    let possMineLocations = this.getBorderSquares(row, col);
    for(let b=0; b<possMineLocations.length; b++){
      if(this.mineAtLocation(possMineLocations[b].row, possMineLocations[b].col, mines)) mineCount++;
    }
    return mineCount;
  }

  isMarkedIndicatingSquare(row, col, currentIndicatingSquares){
    if(currentIndicatingSquares['indict-' + row + '-' + col]) return true;
    return false;
  }


  prepIndicatingSquares(mines){
    let indicatingSquares_prepped = { //indicating squares with right # mines nearby
      count: 0
    };
    let borderSquares = []; //border square to selected square. might include mine
    let indicatingSquares_notSet = []; //e.g. border squares without mines.

    let countOfPreppedSquares = 0;

    for (let m in mines) {
      if (mines.hasOwnProperty(m)) {
        if(m === "count") continue; // the count property doesn't indicate a mine

        borderSquares = this.getBorderSquares(mines[m].row, mines[m].col);
        indicatingSquares_notSet = this.getIndicatingSquares(borderSquares, mines);

        for(let i=0; i<indicatingSquares_notSet.length; i++){
          let row = indicatingSquares_notSet[i].row;
          let col = indicatingSquares_notSet[i].col;
          let numNeabyMines = this.getCountOfNearbyMines(indicatingSquares_notSet[i].row, indicatingSquares_notSet[i].col, mines);

          if(indicatingSquares_prepped['count'] === 0){
            indicatingSquares_prepped['indict-' + row + '-' + col] = {
              row: row,
              col: col,
              numNeabyMines: numNeabyMines
            };
            indicatingSquares_prepped['count'] = ++indicatingSquares_prepped['count'];
            continue;
          }

          if(this.isMarkedIndicatingSquare(row, col, indicatingSquares_prepped)) continue;

          indicatingSquares_prepped['indict-' + row + '-' + col] = {
            row: row,
            col: col,
            numNeabyMines: numNeabyMines
          };

          indicatingSquares_prepped['count'] = ++indicatingSquares_prepped['count'];
        }
      }
    }
    return indicatingSquares_prepped;
  }

  // TODO: get rid of this or use this instead of isMarkedIndicatingSquare
  getIndicatingSquareCount(row, col, currentIndicatingSquares){
    if(currentIndicatingSquares['indict-' + row + '-' + col])
      return currentIndicatingSquares['indict-' + row + '-' + col].numNeabyMines;
    return -1;
  }

  setSquares(squares, mines, indicatingSquares){
    let newSquares = squares;
    for (let s in newSquares) {
      if (mines.hasOwnProperty(s)) {
        if(s === "count") continue;
      }
      if(this.mineAtLocation(newSquares[s].row, newSquares[s].col, mines)){
        newSquares[s].isReally = "mine";
        continue;
      } else if (this.isMarkedIndicatingSquare(newSquares[s].row, newSquares[s].col, indicatingSquares)) { //horrible, I know.
        newSquares[s].isReally = this.getIndicatingSquareCount(newSquares[s].row, newSquares[s].col, indicatingSquares).toString();
        continue;
      }
      newSquares[s].isReally = "blank";
    }

    return newSquares;
  }

  resetGame(){
    if(!this.gameNeedsReset()){
      return; //game doesn't need reset, go about your business
    }
    let newState = this.state;
    let newSquares = this.getBoard();
    newState.mines = this.getMines();
    newState.indicatingSquares = this.prepIndicatingSquares(newState.mines);
    newSquares = this.setSquares(newSquares, newState.mines, newState.indicatingSquares);
    newState.squares = newSquares;
    this.setState(newState);
  }

  //called after every setState
  componentDidUpdate(){
    this.resetGame();
  }

  getSquare(rowIndex, colIndex){
    return(this.state.squares["square-" + rowIndex + "-" + colIndex]);
  }

  isNumber(val){
    if(/^([0-8])$/.test(val)) return true;
    return false;
  }
  pressButton(rowIndex, colIndex, squares){
    let newSquares = squares;
    newSquares["square-" + rowIndex + "-" + colIndex].pressed = true;
    return newSquares;
  }

  /*
   * Checks to see if square {rowIndex, colIndex} has triggered a recursive call
   */
  squareTriggeredRecursion(rowIndex, colIndex){
    if(this.state.triggeringSquares["trigger-" + rowIndex + "-" + colIndex]) return true;
    return false;
  }
  /*
   * Trims border squares that have already performed a recursive call.
   *
   * @param borderSquares squares surrounding {row, col} that need to be trimmedBorderSquares
   */
  trimBorderSquares(borderSquares){
    let trimmedBorderSquares = [];

    for(let b=0; b<borderSquares.length; b++){
      if(this.squareTriggeredRecursion(borderSquares[b].row, borderSquares[b].col))
        continue;
      trimmedBorderSquares.push({
        row: borderSquares[b].row,
        col: borderSquares[b].col
      });
    }

    return trimmedBorderSquares;
  }

  addTriggeringSquaresToState(triggeringSquares){
    let newState = this.state;
    let row;
    let col;
    let count = this.state.triggeringSquares["count"];

    for(let t=0; t<triggeringSquares.length; t++){
      row = triggeringSquares[t].row;
      col = triggeringSquares[t].col;

      newState.triggeringSquares["trigger-" + row + "-" + col] =
      {
        row: row,
        col: col
      }

      newState.triggeringSquares["count"] = ++count;

    }

    this.setState(newState);
  }

  /*
   * Just a simple delay function that returns a Promise
   *
   * @param t the time in milliseconds you want to delay
   */
  delay(t) {
    return new Promise(function(resolve) {
      setTimeout(resolve, t)
    });
  }

  toggle(rowIndex, colIndex){
    let newState = this.state;
    let square = this.getSquare(rowIndex, colIndex);

    if( this.isNumber(square.isReally.toString()) ){
      newState.squares = this.pressButton(rowIndex, colIndex, newState.squares);
      this.setState(newState);
      return;
    }

    if( this.mineAtLocation(rowIndex, colIndex, this.state.mines) ){
      let revealMines = new Promise(function(resolve) {
        let newState = this.state;

        for (let m in this.state.mines) {
          if (this.state.mines.hasOwnProperty(m)) {
            if(m === "count") continue;
            newState.squares = this.pressButton(this.state.mines[m].row, this.state.mines[m].col, newState.squares);
          }
        }

        this.setState(newState);
        resolve();
      }.bind(this));

      let signalGameOver = new Promise(function(resolve){
        alert("Game over man! Game over!\nYour game will be reset in 3 seconds after clicking 'ok'");
        resolve();
      });

      signalGameOver.then(() => {return revealMines}).then(()=>{
        return this.delay(3000).then( ()=>{
          let newState = this.state;
          newState.numRows = 0;
          newState.numCols = 0;
          newState.numMines = 0;
          newState.squares = {};
          newState.mines = {};
          newState.indicatingSquares = {};
          newState.triggeringSquares = {};
          this.setState(newState);

          //now reset form values
          this.refs.numCols.value = "";
          this.refs.numRows.value = "";
          this.refs.numMines.value = "";
        } );
      });

      return;
    }

    //if you got here, hopefully you clicked on a blank square
    newState.squares = this.pressButton(rowIndex, colIndex, newState.squares);
    this.setState(newState);

    //get surrounding squares to the one you just clicked
    let borderSquares = this.getBorderSquares(rowIndex, colIndex);
    let trimmedBorderSquares;
    //check to see if there have been any recursive calls
    if(this.state.triggeringSquares["count"] > 0){
      //check to see if any of the border squares have performed a recursive call
      trimmedBorderSquares = this.trimBorderSquares(borderSquares);

      //if all border squares have been trimmed, there's nothing to do, so return
      if(trimmedBorderSquares.length === 0) return;

      //if they haven't performed a recursive call, they will, so we need to add to state
      this.addTriggeringSquaresToState(trimmedBorderSquares);
      //now trigger those border squares that haven't recursively called anything
      for(let t=0; t<trimmedBorderSquares.length; t++){
        this.toggle(trimmedBorderSquares[t].row, trimmedBorderSquares[t].col);
      }
    } else{ //there hasn't been a recursive call yet
      //so it should be safe to recursively call border squares
      //but you should add them to state first.
      this.addTriggeringSquaresToState(borderSquares);
      for(let t=0; t<borderSquares.length; t++){
        this.toggle(borderSquares[t].row, borderSquares[t].col);
      }
    }
  }


  toggleFlag(rowIndex, colIndex){
    let newState = this.state;
    let square = this.getSquare(rowIndex, colIndex);

    if(square.condition === "unknown"){
      newState.squares['square-' + rowIndex + '-' + colIndex].condition = 'flagged';
      newState.squares['square-' + rowIndex + '-' + colIndex].pressed = true;
      this.setState(newState);
    } else if(square.condition === "flagged"){
      newState.squares['square-' + rowIndex + '-' + colIndex].condition = 'unknown';
      newState.squares['square-' + rowIndex + '-' + colIndex].pressed = false;
      this.setState(newState);
    }
  }


  handleClick(rowIndex, colIndex){
    this.toggle(rowIndex, colIndex);
  }

  handleRightClick(event, rowIndex, colIndex){
    event.preventDefault(); //need the event to prevent context menu
    this.toggleFlag(rowIndex, colIndex);
  }

  getSquarePressState(row, col){
    let square = this.getSquare(row, col);
    if(square) return square.pressed;
  }

  getSquareState(row, col){
    let square = this.getSquare(row, col);
    if(square) return square.isReally;
  }

  getSquareCondition(row, col){
    let square = this.getSquare(row, col);
    if(square) return square.condition;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Minesweeper!</h2>
        </div>
        <p className="App-intro">
          The game I was never quite patient enough to play.
        </p>
        <form onSubmit={this.handleSubmit}>
          <input name="numRows"
             ref="numRows"
             type="text"
             placeholder="Enter Rows"
             onChange={this.handleChange}
             required/>
          <input name="numCols"
            ref="numCols"
            type="text"
            placeholder="Enter Cols"
            onChange={this.handleChange}
            required/>
          <input name="numMines"
            ref="numMines"
            type="text"
            placeholder="Enter Number of Mines"
            onChange={this.handleChange}
            required/>
        </form>
        <Board squares={this.state.squares}
               rows={this.state.numRows}
               cols={this.state.numCols}
               onClick={(row, col) => this.handleClick(row, col)}
               onRightClick={(event, row, col) => this.handleRightClick(event, row, col)}
               getSquarePressState={(row, col) => this.getSquarePressState(row, col)}
               getSquareState={(row, col) => this.getSquareState(row, col)}
               getSquareCondition={(row, col) => this.getSquareCondition(row, col)} />
      </div>
    );
  }
}

export default App;
