var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize);
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {	  
	return (
  	<div className="col-5">
  	  {_.range(props.numberOfStars).map (i=>
      	<i key={i} className="fa fa-star"></i>
      )}
  	</div>
  );
};

const Button = (props) => {
	let button;
  switch (props.answerIsCorrect) {
  	case true:
    	button =
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>;
    	break;
  	case false:
    	button =
        <button className="btn btn-danger" >
          <i className="fa fa-times"></i>
        </button>;  
    	break;
  	default:
    	button =
        <button className="btn"         				
                onClick={props.checkAnswer}
                disabled={props.selectedNumbers.length === 0}>
          =
        </button>;
    	break;      
  }
  
	return (
  	<div className="col-2 text-center">
    	{button}
      <br/><br/>
      <button className="btn btn-warning btn-sm" onClick={props.redraw}
      				disabled={props.redraws === 0}>
        <i className="fa fa-refresh"></i> {props.redraws}
      </button>
  	</div>
  );
};

const Answer = (props) => {
	return (
  	<div className="col-5">
  	  {props.selectedNumbers.map((number,i) =>
      	<span key={i} onClick={() => props.unSelectNumber(number)}>
        	{number}
        </span>
      )}
  	</div>
  );
};

const Numbers =(props) => {	
	const numberClassName = (number) => {
  	if (props.usedNumbers.indexOf(number) >=0 ){
    	return 'used';

    }    
  	if (props.selectedNumbers.indexOf(number) >=0 ){
    	return 'selected';

    }    
  };
  
	return (
  	<div className="card text-center">
  	  <div>
  	    {Numbers.list.map((number,i) => 
        	<span key={i} className={numberClassName(number)}
          	    onClick={() => props.selectNumber(number)}>
          	{number}
          </span>
        )}
  	  </div>
  	</div>	
  );
};

Numbers.list = _.range(1,10);

const DoneFrame = (props) => {
	return (
  	<div className="text-center">
  	  <h2>{props.doneStatus}</h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>
      	Play Again
      </button>
  	</div>
  );
};

class Game extends React.Component {
	static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
  	selectedNumbers : [],
    randomNumberOfStars: Game.randomNumber(),
    usedNumbers: [],
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null,
  });
	state = Game.initialState();
  resetGame = () => this.setState(Game.initialState());
  selectNumber = (clickedNumber) => {  	
  	if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {return;}
  	this.setState(prevstate => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevstate.selectedNumbers.concat(clickedNumber)
    }));
  };
  unSelectNumber = (clickedNumber) => {
  	this.setState(prevstate => ({
    	answerIsCorrect: null,
    	selectedNumbers: prevstate.selectedNumbers
      													.filter(number => number !== clickedNumber)
    }));
  };
  checkAnswer = () => {
  	this.setState(prevstate => ({
    	answerIsCorrect: prevstate.randomNumberOfStars === 
      	prevstate.selectedNumbers.reduce((acc,n) => (acc + n), 0)
    }));
  };
  acceptAnswer = () => {
  	this.setState(prevstate => ({
    	usedNumbers: prevstate.usedNumbers.concat(prevstate.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus);
  };
  redraw = () => {
  	if (this.state.redraws === 0) {return;}
  	this.setState(prevstate => ({
    	randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevstate.redraws -1,
    }), this.updateDoneStatus);
  }
  
  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
  	const possibleNumbers = _.range(1,10).filter(number => 
    	usedNumbers.indexOf(number) === -1
    );
    return possibleCombinationSum (possibleNumbers, randomNumberOfStars);
  };
  updateDoneStatus = () => {
  	this.setState(prevstate => {
    	if (prevstate.usedNumbers.length === 9) {
      	return { doneStatus: 'Done. Nice!'};
      }
    	if (prevstate.redraws === 0 && !this.possibleSolutions(prevstate)) {
      	return { doneStatus: 'Game Over!'};
      }      
    });
  };
  
	render (){
  	const {
    	selectedNumbers, 
      randomNumberOfStars, 
      usedNumbers,
      answerIsCorrect,
      redraws,
      doneStatus,
    } = this.state;

    
  	return (
    	<div className="container">      	
    	  <h3>Play Nine</h3>
        <hr/>
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars}/>
          <Button selectedNumbers={selectedNumbers}
          				checkAnswer={this.checkAnswer}
                  answerIsCorrect={answerIsCorrect}
                  acceptAnswer={this.acceptAnswer}
                  redraw={this.redraw}
                  redraws={redraws}
          />
          <Answer selectedNumbers={selectedNumbers}
          				unSelectNumber={this.unSelectNumber}
          />
        </div>
        <br/>
        {doneStatus ?
        	<DoneFrame doneStatus={doneStatus} resetGame={this.ResetGame}/> :
          <Numbers selectedNumbers={selectedNumbers} 
                   selectNumber={this.selectNumber}
                   usedNumbers={usedNumbers}/>
        }                
    	</div>
    );
  }
}

class App extends React.Component {
	render (){
  	return (
    	<div>
    	  <Game />
    	</div>
    );
  }
} 

ReactDOM.render(<App />, mountNode);