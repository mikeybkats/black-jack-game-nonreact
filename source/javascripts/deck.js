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

function Card(name){
  this.name = name;
  this.value = getCardValue(name);
  this.location = '/images/playcards/' + name;
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

var gameHistoryStruct = [
    {
      name: "computer",
      score: [],
      playHistory: []
    },
    { 
      name: "human",
      score: [],
      playHistory: []
    }
  ];

function reduceScore(){
  // reduces the scores in the score array to a single value
  return gameHistoryStruct.map(function(players){
    var total = players.score.reduce(function(sum, value){
      return sum + value;
    }, 0);
    console.log(total);
    players.score = [];
    players.score.push(total);
  });

}

function getScore(player){
  // returns the current reduced score from json
  return gameHistoryStruct.filter(function(name){
    return name.name === player; 
  }).map(function(players){
    //console.log(players.score);
    return players.score;
  });
}

function setScoreToBoard(){
  reduceScore();
  var scoreContext = {
    playerScore: getScore("human"),
    computerScore: getScore("computer") 
  };

  var playerScore = document.getElementById('playerScore');
  playerScore.innerText = "Player count: " + scoreContext.playerScore;
  var computerScore = document.getElementById('computerScore');
  computerScore.innerText = "Computer count: " + scoreContext.computerScore;
}

function getCardFromDeck(){
  // returns a random card from the deck
  // reduces the total number of cards in the deck
  var card;
  var randomCardNumber = function(){
    var value = Math.floor(Math.random() * cardsWithValue.length + 1);
    return value;
  }
  card = cardsWithValue[randomCardNumber()];
  cardsWithValue.pop(randomCardNumber()); 
  return card;
}

function setCardToHistory(player, card){
  // sets a card to the given player's history
  gameHistoryStruct.filter(function(name){
    return name.name === player; 
  }).map(function(players){
    players.score.push(card.value);
    return players.playHistory.push(card);
  });
} 

function drawBoard(){
  // pulls cards from gameHistoryStruct arrays and puts them on the board  
  // calls the score functions to update counts.
  var gameBoardPlayer = $('#playerDealtCard');
  var gameBoardComputer = $('#computerDealtCard');
  $( "#playerDealtCard" ).empty();
  $( "#computerDealtCard" ).empty();
  gameBoardPlayer.append(
      "<img class=\"card\" src=\"images/cover.svg\">"
  );
  gameBoardComputer.append(
      "<img class=\"card\" src=\"images/cover.svg\">"
  );
  
  gameHistoryStruct.map(function(players){
      if (players.name === "human"){
        players.playHistory.map(function(card){
          gameBoardPlayer.append(
              "<img class=\"card playcard\" src=\"." + card.location + "\">"
              );
        });
      }
      if (players.name === "computer"){
        players.playHistory.map(function(card){
          gameBoardComputer.append(
              "<img class=\"card playcard\" src=\"." + card.location + "\">"
              );
        });
      }
  });
  
}

function startGame(event){
  var playerCard = getCardFromDeck();
  setCardToHistory("human", playerCard);

  var computerCard = getCardFromDeck(); 
  setCardToHistory("computer", computerCard);

  drawBoard();
}

function hit(event){
  $("#hit").on('click', function(){
    setCardToHistory("human", getCardFromDeck());
    reduceScore();
    setScoreToBoard();
    drawBoard();
  });
}

$(document).ready(function(){
  makeCards();
  startGame();

  //setScoreToHistory();
  setScoreToBoard();
  hit();
});
