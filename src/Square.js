/*React Core Stuff*/
import React from 'react';
/*React DOM Stuff*/
import ReactDOM from 'react-dom';
import Button from 'react-button';
/*My Stuff*/
import './css/Square.css';
import mine_detected from './images/mine_detected.png';
import mine_eliminated from './images/mine_eliminated.png';
import mine_exploded from './images/mine_exploded.png';
import mine_flagged from './images/mine_flagged.png';
import mine_possiblyDetected from './images/mine_possiblyDetected.png';
import mine_possiblyUndetected from './images/mine_possiblyUndetected.png';
import isOne from './images/isOne.png';
import isTwo from './images/isTwo.png';
import isThree from './images/isThree.png';
import isFour from './images/isFour.png';
import isFive from './images/isFive.png';
import isSix from './images/isSix.png';
import isSeven from './images/isSeven.png';
import isEight from './images/isEight.png';


//TODO can this be made stateless?
class Square extends React.Component {
  constructor(props){
    super(props);
    this.state={
      position:{
        rowIndex: props.row,
        colIndex: props.col
      },
      currently_showing: props.currently_showing,
      pressed: props.pressed
    }
    this.toggle = this.toggle.bind(this);
  }


  toggle(){
    let newState = this.state;
    newState.pressed = !this.props.pressed;
    this.setState({newState});
  }


  getSquareState(isReallyState){
    switch(isReallyState){
      case "mine":
        return( { pressedStyle: { background: "url(" + mine_exploded + ")" } });
      case "1":
        return( { pressedStyle: { background: "url(" + isOne + ")" } });
      case "2":
        return( { pressedStyle: { background: "url(" + isTwo + ")" } });
      case "3":
        return( { pressedStyle: { background: "url(" + isThree + ")" } });
      case "4":
        return( { pressedStyle: { background: "url(" + isFour + ")" } });
      case "5":
        return( { pressedStyle: { background: "url(" + isFive + ")" } });
      case "6":
        return( { pressedStyle: { background: "url(" + isSix + ")" } });
      case "7":
        return( { pressedStyle: { background: "url(" + isSeven + ")" } });
      case "8":
        return( { pressedStyle: { background: "url(" + isEight + ")" } });
    }
  }

  /*
  getSquareState(){
    switch(this.state.currently_showing){
      case "exploded":
        return( { pressedStyle: { background: "url(" + mine_exploded + ")" } });
      case "detected":
        return( { pressedStyle: { background: "url(" + mine_detected + ")" } });
      case "eliminated":
        return( { pressedStyle: { background: "url(" + mine_eliminated + ")" } });
      case "flagged":
        return( { pressedStyle: { background: "url(" + mine_flagged + ")" } });
      case "possibyDetected":
        return( { pressedStyle: { background: "url(" + mine_possiblyDetected + ")" } });
      case "possiblyUndetected":
        return( { pressedStyle: { background: "url(" + mine_possiblyUndetected + ")" } });
      case "isOne":
        return( { pressedStyle: { background: "url(" + isOne + ")" } });
      case "isTwo":
        return( { pressedStyle: { background: "url(" + isTwo + ")" } });
      case "isThree":
        return( { pressedStyle: { background: "url(" + isThree + ")" } });
      case "isFour":
        return( { pressedStyle: { background: "url(" + isFour + ")" } });
      case "isFive":
        return( { pressedStyle: { background: "url(" + isFive + ")" } });
      case "isSix":
        return( { pressedStyle: { background: "url(" + isSix + ")" } });
      case "isSeven":
        return( { pressedStyle: { background: "url(" + isSeven + ")" } });
      case "isEight":
        return( { pressedStyle: { background: "url(" + isEight + ")" } });
    }
  }
  */
  //
  createSquare(condition){
    //let theme = this.getSquareState(condition);
    switch(condition) {
      case "unknown":
          return(<Button className="minesweeper_button"
                         theme={this.getSquareState(this.props.isReally)}
                         pressed={this.props.pressed}
                         onClick={() => this.props.onClick()}/>);
      default:
          return(<Button className="minesweeper_button" value="E"/>);
    }
  }

  render(){
    return(
      <div>
        { this.createSquare(this.props.condition) }
      </div>
    );
  }

}

export default Square;
