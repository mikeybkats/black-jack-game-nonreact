var cards = [
  "10C.svg", "3C.svg", "5C.svg", "7C.svg", "9C.svg",
  "JC.svg", "KH.svg", "10D.svg", "3D.svg", "5D.svg",
  "7D.svg", "9D.svg", "JD.svg", "KS.svg","10H.svg",
  "3H.svg", "5H.svg", "7H.svg", "9H.svg", "JH.svg", 
  "QC.svg", "10S.svg", "3S.svg", "5S.svg", "7S.svg",
  "9S.svg", "JS.svg", "QD.svg", "2C.svg", "4C.svg",
  "6C.svg", "8C.svg", "AC.svg", "QH.svg", 
  "2D.svg", "4D.svg", "6D.svg", "8D.svg", 
  "AD.svg", "QS.svg", "2H.svg", "4H.svg", 
  "6H.svg", "8H.svg", "AH.svg", "KC.svg", 
  "2S.svg", "4S.svg", "6S.svg", "8S.svg", 
  "AS.svg", "KD.svg"
];

var cardsWithValue = [];

function getScore(){

}

function Card(name){
  this.name = name;
  this.value = getCardValue(name);
  //this.suit = getCardSuit(name);
}

function getCardValue(card){
  var value;
  //if the first letter of card is A value = 1
  if(card[0] === 'A'){
    value = 1; 
  } 
  //if first letter of card is 9 or less value = number
  if(parseInt(card[0])<=9 && parseInt(card[1]) != 0 ){
    value = parseInt(card[0]);
  }
  //else value = 10
  else{
    value = 10;
  }
  return value;
}

function makeCards(){
  for(var i = 0; i < cards.length; i++){
    cardsWithValue.push(new Card(cards[i]));
  }
}

function gameBoard(){
  var playerHand = [];
  var computerHand = [];
  
}

var gameHistoryStruct = [
    { 
      name: "human",
      score: [],
      playHistory: []
    },
    {
      name: "computer",
      score: [],
      playHistory: []
    }
  ];

function reduceScore(){
  gameHistoryStruct.map(function(players){
    players.score.reduce(function(sum, value){
      return sum + value;
    }, 0);
  });
}

function getScore(player){
  // returns the current reduced score from json
  reduceScore();
  return gameHistoryStruct.filter(function(name){
    return name.name === player; 
  }).map(function(players){
    console.log(players.score);
    return players.score;
  });
}

function setScore(){
  // sets the current score in the json
  var scoreContext = {
    playerScore: getScore("human"),
    computerScore: getScore("computer") 
  };

  console.log(scoreContext.playerScore);

  var playerScore = document.getElementById('playerScore');
  playerScore.innerText = "Count: " + scoreContext.playerScore;
  var computerScore = document.getElementById('computerScore');
  computerScore.innerText = "Count: " + scoreContext.computerScore;
 
}

function setPlayHistory(){
  // push the play history to json 
  gameHistoryStruct.map(function(players){
    var value = 0;
    console.log(players);
    players.playHistory.map(function(card){
      console.log("card value:" +card.value);
      // push card to history
      players.playHistory.push(card.value);
      value = value + card.value;
      // push score to totale score
      players.score.push(value);
    });
  });
  //console.log(gameHistoryStruct[1].score);
  //console.log(gameHistoryStruct[0].score);
}

function setBoard(event){
  // pulls the game history from the json and pushes it to the board
  var randomCardNumber = function(){
    var value = Math.floor(Math.random() * cardsWithValue.length + 1);
    return value;
  }

  var gameBoardPlayer = document.getElementById('playerDealtCard');
  var gameBoardComputer = document.getElementById('computerDealtCard');
  
  var playerCard = randomCardNumber();
  gameHistoryStruct[0].playHistory.push(cardsWithValue[playerCard]);
  cardsWithValue.pop(playerCard);

  var computerCard = randomCardNumber();
  gameHistoryStruct[1].playHistory.push(cardsWithValue[computerCard]);
  cardsWithValue.pop(computerCard);
  
  gameBoardComputer.src = './images/' + cardsWithValue[computerCard].name;
  gameBoardPlayer.src = './images/' + cardsWithValue[playerCard].name;  
}

$(document).ready(function(){
  makeCards();
  setBoard();
  setPlayHistory();
  setScore();
});
