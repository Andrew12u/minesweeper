import React, { Component } from 'react';
import './css/Board.css';
import Square from './Square';

//TODO can this be made stateless?
class Board extends React.Component {

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
      pressedState = this.props.getSquarePressState(rowIndex, colIndex);
      isReallyState = this.props.getSquareState(rowIndex, colIndex);
      condition =  this.props.getSquareCondition(rowIndex, colIndex);
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
}

export default Board;
