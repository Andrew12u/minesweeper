/*React Core Stuff*/
import React from 'react';
/*React DOM Stuff*/
import Button from 'react-button';
/*My Stuff*/
import './css/Square.css';

//Why all the uneeded imports?
//Couldn't get it to work with backticked inline styles
import mine_exploded from './images/mine_exploded.png';
import mine_flagged from './images/mine_flagged.png';
import isOne from './images/isOne.png';
import isTwo from './images/isTwo.png';
import isThree from './images/isThree.png';
import isFour from './images/isFour.png';
import isFive from './images/isFive.png';
import isSix from './images/isSix.png';
import isSeven from './images/isSeven.png';
import isEight from './images/isEight.png';
import error from './images/error.png';


class Square extends React.Component {

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
      default: //default is the normal behavior or the react-button theme
        return;
    }
  }

  getConditionState(condition){
    switch(condition){
      case "flagged":
        return( { pressedStyle: { background: "url(" + mine_flagged + ")" } });
      default: // you should only get in this function if condition === "flagged"
        return( { pressedStyle: { background: "url(" + error + ")" } } );
    }
  }

  createSquare(condition){
    switch(condition) {
      case "unknown":
          return(<Button className="minesweeper_button"
                         theme={this.getSquareState(this.props.isReally)}
                         pressed={this.props.pressed}
                         onClick={() => this.props.onClick()}
                         onContextMenu={(event) => this.props.onRightClick(event)} />);
     case "flagged": //note the absence of the onClick() event. This should prevent user click
         return(<Button className="minesweeper_button"
                        theme={this.getConditionState(this.props.condition)}
                        pressed={this.props.pressed}
                        onContextMenu={(event) => this.props.onRightClick(event)} />);
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
