import React, { Component } from 'react';
import './css/Board.css';
import Square from './Square';

//TODO can this be made stateless?
class Board extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div>
        {this.generateBoard(this.props.rows, this.props.cols)}
      </div>
    );
  }

  generateBoard(numRows, numCols){
    let rows = [];
    for(let rowIndex=0; rowIndex<numRows; rowIndex++){
      rows.push( <div key={rowIndex}>{this.generateRow(rowIndex, numCols)}</div> );
    }
    return rows || null;
  }
  generateRow(rowIndex, numCols){
    return(
      <div className="board-row">
        {this.generateColumns(rowIndex, numCols)}
      </div>
    );
  }

  generateColumns(rowIndex, numCols){
    let squares = [];
    let pressedState;
    let isReallyState = "";
    let condition = "";
    for(let colIndex=0; colIndex<numCols; colIndex++){
      pressedState = this.getSquarePressState(rowIndex, colIndex, this.props.squares);
      isReallyState = this.getSquareState(rowIndex, colIndex, this.props.squares);
      condition =  this.getSquareCondition(rowIndex, colIndex, this.props.squares);
      squares.push(<Square key={colIndex + numCols}
                           pressed={pressedState}
                           isReally={isReallyState}
                           condition={condition}
                           row={rowIndex} col={colIndex}
                           onClick={() => this.props.onClick(rowIndex, colIndex)}
                           onRightClick={(event) => this.props.onRightClick(event, rowIndex, colIndex)} />
                  );
    }
    return squares || null;
  }

  getSquarePressState(row, col, squares){
    for(let s=0; s<squares.length; s++){
      if(squares[s].row == row){
        if(squares[s].col == col){
          return squares[s].pressed;
        }
      }
    }
  }

  getSquareState(row, col, squares){
    for(let s=0; s<squares.length; s++){
      if(squares[s].row == row){
        if(squares[s].col == col){
          return squares[s].isReally;
        }
      }
    }
    return "";
  }

  getSquareCondition(row, col, squares){
    for(let s=0; s<squares.length; s++){
      if(squares[s].row == row){
        if(squares[s].col == col){
          return squares[s].condition;
        }
      }
    }
    return "";
  }

  isMine(row, col){
    for(let m=0; m<this.props.mines.length; m++){
      if(this.props.mines[m].row === row)
        if(this.props.mines[m].col === col)
          return true;
    }
    return false;
  }

  isMarkedIndicatingSquare(row, col){
    for(let m=0; m<this.props.indicatingSquares.length; m++){
      if(this.props.indicatingSquares[m].row === row)
        if(this.props.indicatingSquares[m].col === col)
          return true;
    }
    return false;
  }

  getIndicatingSquareCount(row, col){
    for(let m=0; m<this.props.indicatingSquares.length; m++){
      if(this.props.indicatingSquares[m].row === row)
        if(this.props.indicatingSquares[m].col === col)
          return this.props.indicatingSquares[m].numNeabyMines.toString();
    }
    return -1;
  }

}

export default Board;
