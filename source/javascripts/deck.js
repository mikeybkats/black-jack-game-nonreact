var gameHistoryStruct = [
    {
      name: "computer",
      score: [],
      playHistory: [],
      secretCard: []
    },
    { 
      name: "human",
      score: [],
      playHistory: []
    }
  ];

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

function Card(name, value, location){
  this.name = name;
  this.value = getCardValue(name);
  this.location = '/images/playcards/' + name;
}

var secretCardCover = new Card("cover.svg");

function getCardValue(card){
  var value;
  //if the first letter of card is A value = 1
  if(card[0] === 'A'){
    value = 11;
    return value;
  } 
  //if first letter of card is 9 or less value = number
  if(parseInt(card[0])<=9 && parseInt(card[1]) != 0 ){
    value = parseInt(card[0]);
		return value;
  }
	if(card[0] === 'c'){
		value = 0;
		return value;
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

function reduceScore(){
  // reduces the scores in the score array to a single value
  return gameHistoryStruct.map(function(players){
    var total = players.score.reduce(function(sum, value){
      return sum + value;
    }, 0);
    players.score = [];
    players.score.push(total);
  });
}

function getScore(player){
  // returns the current reduced score from json
  var number = gameHistoryStruct.filter(function(name){
    return name.name === player; 
  }).map(function(players){
    return players.score[0];
  });
  return number[0];
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
    var value = Math.floor(Math.random() * cardsWithValue.length);
    return value;
  }
  cardNumber = randomCardNumber();
  card = cardsWithValue[cardNumber];
  cardsWithValue.splice(cardNumber, 1); 
  return card;
}

function setCardToHistory(player, card){
  // sets a card to the given player's history in the game struct
  gameHistoryStruct.filter(function(name){
    return name.name === player; 
  }).map(function(players){
    players.score.push(card.value);
    players.playHistory.push(card);
  });
} 

function setSecretCardToHistory(card){
  gameHistoryStruct.filter(function(name){
    return name.name === "computer";
  }).map(function(players){
    players.secretCard.push(card);
  });
}

function drawBoard(){
  // pulls cards from gameHistoryStruct arrays and puts them on the board  
  // calls the score functions to update counts.
  var gameBoardPlayer = $('#playerDealtCard');
  var gameBoardComputer = $('#computerDealtCard');
  gameBoardComputer.empty();
  gameBoardPlayer.empty();

	gameHistoryStruct.map(function(players){
    if (players.name === "human"){
      players.playHistory.map(function(card){
        gameBoardPlayer.append(
            "<img class=\"card playcard\" src=\"." + card.location + "\">"
            );
      });
    }

    if (players.name === "computer"){
      var faceCard = players.playHistory.map(function(cards){
        return cards; 
      });
      // the computer draws two cards. one of them is set face up. the other face down
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
  var playerCard = getCardFromDeck();
  setCardToHistory("human", playerCard);

  var computerSecretCard = getCardFromDeck();
  var computerCard = getCardFromDeck(); 
	setCardToHistory("computer", secretCardCover);
  setCardToHistory("computer", computerCard);
  setSecretCardToHistory(computerSecretCard);

  evaluateCount("human");
  drawBoard();
}

function hit(player){
    setCardToHistory(player, getCardFromDeck());
    reduceScore();
    setScoreToBoard();
    drawBoard();
    evaluateCount("human");
}

function stay(){
  // turn the dealer's secret card
  var secretCardArr = gameHistoryStruct.filter(function(player){
    return player.name === "computer"; 
  }).map(function(secret){
    return secret.secretCard[0];
  });
  //console.log(secretCardArr[0]);
  $("#secretCard").attr("src", secretCardArr[0].location);
  // push the secretCard to the history
  setCardToHistory("computer", secretCardArr[0]);  
	// splice the cover card from the history
	gameHistoryStruct.filter(function(players){
		return players.name === "computer";
	}).map(function(player){
		console.log(player);
		return player.playHistory.splice(0,1);		
	});
  // recount the dealers score
  reduceScore();
  setScoreToBoard();
  drawBoard();
  // if the score is above 18 then stay
  // if below 18 then decide who the winner is. 
    // the higher score wins!
}

function checkHistoryForAces(player){
  var replaceCardsArr = []; 
  // returns an array of replacement cards if there are any aces.
  // sets any aces to value of 1
  // if there are no aces it returns false
  var makeNewAces = gameHistoryStruct.filter(function(name){
    return name.name === player; 
    }).map(function(player){
      return player.playHistory.map(function(card){
        if(card.name[0] !== "A"){
          replaceCardsArr.push(card);
        }
        else{
          replaceCardsArr.push({
            "name": card.name,
            "value": 1,
            "location": card.location
          });
        }
        return card;
      }).filter(function(card){
        return card.name[0] === "A";
      }); 
    });
  if(makeNewAces.length > 0){
    return replaceCardsArr;
  }else{
    return false;
  }
}

function wipeAndReplaceHistory(player, newHistory){
  // takes an array as input
  // wipes the old history and replaces it with the new history
  gameHistoryStruct.filter(function(name){
    return name.name === player; 
    }).map(function(playerPerson){
      // iterate through the players and go to history
      // clear the history
      playerPerson.playHistory = [];
      playerPerson.score = [];
      // replace the history with newHistory
      newHistory.map(function(card){
        setCardToHistory(player, card);
      });
  });
  return player;
}

function evaluateCount(player){
  // if the count is above 21: 
  var currentCount = getScore(player);
  if(currentCount > 21 && checkHistoryForAces(player).length > 0){
    wipeAndReplaceHistory( player, checkHistoryForAces(player) );
    reduceScore();
    setScoreToBoard();
  }
  if (currentCount > 21){
    drawBoard();
    return false;
  }
  else{
    return true;
  }
  // if the count is less than the computer count the player return false
  // if the count is greater than the computer count return true
}

$(document).ready(function(){
  makeCards();
  startGame();
  setScoreToBoard();

  $("#hit").on('click', function(event){
    hit("human");
  });

  $("#stay").on('click', function(event){
    stay();
  });
});
