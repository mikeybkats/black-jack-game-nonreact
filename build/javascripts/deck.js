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
}

function getCardValue(card){
  const value;
  //if the first letter of card is A value = 1
  if(card[0] === 'A'){
    value = 1; 
  } 
  //if first letter of card is 9 or less value = number
  if(parseInt(card[0])<=9){
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

function getCard(event){
  var randomCardNumber = Math.floor(Math.random() * cards.length + 1);
  var gameBoardLocation = document.getElementById('placecard');
  return 
}

makeCards();
