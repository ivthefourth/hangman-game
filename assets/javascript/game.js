(function(){

//blank screen is shown on page load, then
//replaced with home screen line by line
const blankScreen = 
`<span id="l0">                                                                         </span>
<span id="l1">                                                                         </span>
<span id="l2">                                                                         </span>
<span id="l3">                                                                         </span>
<span id="l4">                                                                         </span>
<span id="l5">                                                                         </span>
<span id="l6">                                                                         </span>
<span id="l7">                                                                         </span>
<span id="l8">                                                                         </span>
<span id="l9">                                                                         </span>
<span id="l10">                                                                         </span>
<span id="l11">                                                                         </span>
<span id="l12">                                                                         </span>
<span id="l13">                                                                         </span>
<span id="l14">                                                                         </span>
<span id="l15">                                                                         </span>
<span id="l16">                                                                         </span>
<span id="l17">                                                                         </span>
<span id="l18">                                                                         </span>
`
//ui screen is 19 characters high
//ui screen is 73 characters wide
const homeScreen = 
`                                                                         


                                                                         
                                                                         
                                                                         
                     [++]=======================[++] 
                      ||                         ||
                      ||      H A N G M A N      ||
                      ||                         ||
                      ||  <span class="blinking-text">Press any key to play</span>  ||   
                      ||                         ||
                     [++]=======================[++]                  
                                                                      
                                                                       
    
                                                                         
               

`

// body sections should be 5 characters wide
var body = {
   empty: [
   '<span id="body0">     </span>',
   '<span id="body1">     </span>',
   '<span id="body2">     </span>',
   '<span id="body3">     </span>',
   '<span id="body4">     </span>',
   '<span id="body5">     </span>',
   '<span id="body6">     </span>',
   '<span id="body7">     </span>',
   '<span id="body8">     </span>',
   ],
   hair: " ,;, ",
   heads: {
      normal: "<span class=\"blinking-eyes\"><span class=\"open\">('_')</span><span class=\"closed\">(-_-)</span></span>",
      happy: "(^_^)",
      sad: "(;_;)",
      uhoh: "(o_o)"
   },
   neck: "  |  ",
   torso: {
      upper: ["  M  ", " /M  ", " /M\\ "],
      lower: ["  H  ", "/ H  ", "/ H \\"],
      upperDance: [
                   "<span class=\"dance\">     <span class=\"dance-a\">\\/M  </span><span class=\"dance-b\"> /M  </span></span>",
                   "<span class=\"dance\">     <span class=\"dance-a\">\\/M\\ </span><span class=\"dance-b\"> /M\\/</span></span>"
                   ],
      lowerDance: [
                   "<span class=\"dance\">     <span class=\"dance-a\">  H  </span><span class=\"dance-b\">/ H  </span></span>",
                   "<span class=\"dance\">     <span class=\"dance-a\">  H \\</span><span class=\"dance-b\">/ H  </span></span>"
                   ]
   },
   hips: "  X  ",
   legs: {
      upper: [" /   ", " / \\ "],
      lower: ["/    ", "/   \\"]
   },
   death: [
      [
      "  |  ",
      " ,;, ",
      "(-,-)",
      "  |  ",
      " /M\\ ",
      "/ H \\",
      "  X  ",
      " / \\ ",
      "/   \\"
      ],
      [
      "  |  ",
      " ,;, ",
      "(x_x)",
      "  |  ",
      " /M\\ ",
      " \\H/ ",
      "  X  ",
      " | | ",
      " | | "
      ]
   ]
}


// "You Win/Lose" statement should be 9 characters wide
var winText = '<span class="blinking-text">You Win! </span>   Play Again? (y/n)';
var loseText = '<span class="blinking-text">You Lose!</span>   Play Again? (y/n)';
var endGameOK = '             OK.             ';
var endGame = '            Wait.            ';

//game screen for new word
const hangmanScreen = 
`                                                                         

                      <span id="end-game">${endGame}</span>                      
  
           
          [++]=====[+]               
           ||       |              
           ||     ${body.empty[0]}        word: <span id="word"></span>
           ||     ${body.empty[1]}        
           ||     ${body.empty[2]}              
           ||     ${body.empty[3]}        misses: <span id="misses"></span>
           ||     ${body.empty[4]}                 
           ||     ${body.empty[5]}        
           ||     ${body.empty[6]}        wins: <span id="wins"></span> 
          /++\\    ${body.empty[7]}        losses: <span id="losses"></span>
         //||\\\\   ${body.empty[8]}                                                
        // || \\\\                                                       
  =====================================================================  

`

//word should be maximum 14 characters long
const wordList = ['PacMan',
                  'Super Mario',
                  'Donkey Kong',
                  'Tetris',
                  'Doom',
                  'Mortal Kombat',
                  'Space Invaders'
                 ];





//returns random integer, inclusive 
function randint(min, max) {
   return min + Math.floor(Math.random() * (max - min + 1));
}

/***************************\
      Single Word Game
\***************************/

//game object for one word
//each new word is a new game instance
function game(word, ui, wins, losses, callback){
   //track wins and losses
   this.wins = wins;
   this.losses = losses;

   //when true, keypresses will guess letter 
   //is set false on guess
   //is set true after animations finish
   this.ready = false;

   //when game is done, isFinished is true
   //win is true if game is won, false if lost
   this.isFinished = false;
   this.win = null;

   //remaining guesses
   this.guessesLeft = 6; 

   //word to guess
   this.word = word;
   this.wordArr = word.split('').map(
      (l) => l.toLowerCase()
   );

   //word to guess as displayed to user
   this.userArr = this.wordArr.map(
      (l) => l === ' ' ? ' ' : '_'
   );

   //all letters that the user has guessed
   this.guessedLetters = [];

   //guessed letters not in word (displayed)
   this.misses = [];

   //used to update visual interface
   this.ui = ui;

   //callback to call when user chooses wether to play a new game
   this.callback = callback;

}
//guess a letter
game.prototype.guess = function(letter) {
   //if guessed letter has not been guessed,
   //add the letter to our guessed letters and...
   if( this.guessedLetters.indexOf(letter) === -1){

      //disable input until animations finish
      //and store gussed letter
      this.ui.setWait(this);
      this.guessedLetters.push(letter);

      //find all indices of guessed letter in word and push
      //index value(s) to indices array
      let indices = [];
      for(let i = 0; i < this.wordArr.length; i++){
         if( letter === this.wordArr[i]){
            indices.push(i);
         }
      }

      //if letter is found in our word,
      //update word as seen by user replacing blanks with
      //selected letter taken from original word (for case)
      if( indices.length ){
         indices.forEach((i) => {
            this.userArr[i] = this.word[i];
         });
         var goodGuess = true;
      }
      //otherwise reduce guesses left by one,
      //and push letter to misses
      else{
         this.guessesLeft -= 1;
         this.misses.push(letter);
         goodGuess = false;
      }

      //check for win, and update relevant state if it is
      if(this.userArr.join('') === this.word){
         this.isFinished = true;
         this.win = true;
         this.wins += 1;
      } 
      //check for loss, and update relevant state if it is
      else if( this.guessesLeft === 0){
         this.isFinished = true;
         this.win = false;
         this.losses += 1;
      }

      //update interface
      if( goodGuess ){
         this.ui.goodChoice(this);
      }
      else{
         this.ui.badChoice(this);
      }
   }
};
//start a new game or back to home screen
//answer true to play again, false to return home
game.prototype.playAgain = function(answer) {
   this.callback(answer, this.win);
};




/***************************\
       User Interface       
\***************************/

//updates visual user interface
//element arg is the DOM element to use for UI
function ui(element, callback){
   //set ui to blank screen on page load
   element.innerHTML = blankScreen;

   //stores homescreen and hangman game screen as arrays of individual lines
   this.homeScreen = homeScreen.split('\n');
   this.hangmanScreen = hangmanScreen.split('\n');

   //change screen to homescreen 
   setTimeout( this.changeScreen.bind(this, 0, this.homeScreen, callback, 150));
}
//recursively changes screen one line at a time
//line = current line being set,
//screenArr is the array of lines for new screen
ui.prototype.changeScreen = function(line, screenArr, callback){
   if (line > 18 ){
      callback();
   }
   else{
      document.getElementById(`l${line}`).innerHTML = screenArr[line];
      setTimeout(this.changeScreen.bind(this, line + 1, screenArr, callback), 75);
   }
}
//set display of wins/losses, word, and ready for input
//animated one at a time
ui.prototype.initGame = function(game){
   var a = () => {
      this.updateWins(game);
      setTimeout(b, 500);
   }
   var b = () => {
      this.updateWord(game);
      setTimeout(c, 500);
   }
   var c = () => {
      this.setReady(game);
   }
   a();
}
//updates word on display as letters are guessed correctly
ui.prototype.updateWord = function(game){
   document.getElementById('word').innerHTML = game.userArr.join(' ');
}
//updates display of letters that have been guessed but are not in word
ui.prototype.updateMisses = function(game){
   document.getElementById('misses').innerHTML = game.misses.join(', ');
}
//updates display for both wins and losses
ui.prototype.updateWins = function(game){
   document.getElementById('wins').innerHTML = game.wins;
   document.getElementById('losses').innerHTML = game.losses;
}
//updates display of body parts
//partnum is the number on the id of the element to be changed
ui.prototype.updateBody = function(partNum, html){
   document.getElementById(`body${partNum}`).innerHTML = html;
}
//sets interface ready for input 
ui.prototype.setReady = function(game){
   document.getElementById('end-game').innerHTML = endGameOK;
   game.ready = true; 
}
//sets interface to not accept user input
ui.prototype.setWait = function(game){
   document.getElementById('end-game').innerHTML = endGame;
   game.ready = false; 
}
//updates top text to say you win and sets body to dance
ui.prototype.setWin = function(game){
   document.getElementById('end-game').innerHTML = winText;
   if( game.guessesLeft === 3){
      this.updateBody(3, body.torso.upperDance[0]);
      this.updateBody(4, body.torso.lowerDance[0]);
   }
   else if( game.guessesLeft <= 2){
      this.updateBody(3, body.torso.upperDance[1]);
      this.updateBody(4, body.torso.lowerDance[1]);
   }
   game.ready = true; 
}
//updates top text to say you lost
ui.prototype.setLoss = function(game){
   document.getElementById('end-game').innerHTML = loseText;
   game.ready = true; 
}
//update interface when user chooses right letter
ui.prototype.goodChoice = function(game){
   var ready = () => {
      if( game.isFinished ){
         //animate more
         //change guy to dance 
         this.updateWins(game);
         this.setWin(game);
      }
      else{
         if (game.guessesLeft <=5){
            this.updateBody(1, body.heads.normal);
         }
         this.setReady(game);
      }
   }
   //iff guesses left is 6 just update word then ready
   var word = () => {
      this.updateWord(game);
      setTimeout(ready, 500);
   }
   if (game.guessesLeft <= 5){
      this.updateBody(1, body.heads.happy);
   }
   setTimeout(word, 500);
}
//update interface when user chose wrong letter
ui.prototype.badChoice = function(game){
   var deathA = () => {
      for( let i = 0; i < 9; i++){
         this.updateBody(i, body.death[0][i]);
      }
      setTimeout(deathB, 500);
   }
   var deathB = () => {
      for( let i = 0; i < 9; i++){
         this.updateBody(i, body.death[1][i]);
      }
      setTimeout(end, 500);
   }
   var end = () => {
      this.updateWins(game);
      this.setLoss(game);
   }
   var ready = () => {
      if( game.isFinished ){
         this.updateBody(1, body.heads.uhoh);
         //do death animation
         setTimeout(deathA, 500);
      }
      else{
         this.updateBody(1, body.heads.normal);
         this.setReady(game);
      }
   }
   //iff guesses left is 6 just update word then ready
   var miss = () => {
      this.updateMisses(game);
      switch(game.guessesLeft){
         case 5:
            this.updateBody(0, body.hair);
            this.updateBody(1, body.heads.sad);
            break;
         case 4:
            this.updateBody(2, body.neck);
            this.updateBody(3, body.torso.upper[0]);
            this.updateBody(4, body.torso.lower[0]);
            this.updateBody(5, body.hips);
            break;
         case 3:
            this.updateBody(3, body.torso.upper[1]);
            this.updateBody(4, body.torso.lower[1]);
            break;
         case 2:
            this.updateBody(3, body.torso.upper[2]);
            this.updateBody(4, body.torso.lower[2]);
            break;
         case 1:
            this.updateBody(6, body.legs.upper[0]);
            this.updateBody(7, body.legs.lower[0]);
            break;
         case 0:
            this.updateBody(6, body.legs.upper[1]);
            this.updateBody(7, body.legs.lower[1]);
            break;
      }
      setTimeout(ready, 500);
   }
   if (game.guessesLeft < 5){
      this.updateBody(1, body.heads.sad);
   }
   setTimeout(miss, 500);
}



/***************************\
     Main Hangman Object    
\***************************/

const hangman = {
   //when true, pressing any key starts new game
   //is set true after page is loaded and animations finish
   ready: false,

   //copy words array, so it can be reset if all words are played 
   words: wordList.slice(0),

   //track wins and losses
   wins: 0,
   losses: 0,

   //stores current active game
   //set null if user chooses not to play a new game
   currentGame: null,

   //callback from game when game is over
   //prepares this object for a new game
   gameFinished: function(playAgain, hasWon) {

      //track wins/losses
      if( hasWon ){
         this.wins += 1;
      }
      else{
         this.losses += 1;
      }

      //start a new game if they want to play again
      if(playAgain){
         this.startNewGame();
      }
      //back to homescreen if they dont want to play again
      else{
         //callback just sets this object to accept user input 
         callback = function(){this.ready = true }.bind(this);

         //reset data to defaults
         this.ready = false;
         this.currentGame = null;
         this.wins = 0;
         this.losses = 0;
         this.words = wordList.slice(0);

         //update ui to home 
         this.ui.changeScreen.bind(this.ui, 0, this.ui.homeScreen, callback, 150)()
      }
   },

   //creates and stores new game object, which starts gameplay
   startNewGame: function() { 

      //if all of the words have been used up,
      //reset the hangman words array
      let len = this.words.length;
      if( len === 0 ){
         this.words = wordList.slice(0);
         len = this.words.length;
      }

      //get random word and start new game with this word
      let index = randint(0, len - 1);
      let word = this.words[index];
      //remove used word so you won't play it again
      this.words.splice(index, 1);
      this.currentGame = new game(word, 
                                  this.ui, 
                                  this.wins,
                                  this.losses,
                                  this.gameFinished.bind(this)
                                 );
      //change ui to show new hangman screen
      this.ui.changeScreen(0, 
                           this.ui.hangmanScreen, 
                           this.ui.initGame.bind(this.ui, this.currentGame)
                          );
   }
}
//user interface
hangman.ui = new ui(
   document.getElementById('ui'), () => {hangman.ready = true }
);




/***************************\
      Keyboard Events
\***************************/

//handles keyup on the window
//calls functions based on state of hangman and hangman.currentgame
function keyHandler(e){
   let game = hangman.currentGame;
   let keyCode = e.keyCode;

   //start new game with any key if no current game
   if(game === null){
      if(hangman.ready){
         e.preventDefault();
         hangman.startNewGame();
      }
   }
   //if current game has finished, y/n keys will
   //either start a new game or go back to home screen
   else if(game.isFinished && game.ready){
      if( keyCode === 89){
         game.playAgain(true);
      }
      else if( keyCode === 78){
         game.playAgain(false);
      }
   }
   //if current game exists and is ready for input
   //and key is a letter, use that letter to guess 
   else if(game.ready){
      if( 65 <= keyCode && keyCode <= 90){
         //guess letter
         e.preventDefault();
         game.guess(
            String.fromCharCode(keyCode).toLowerCase()
         );
      }
   }
}
window.addEventListener('keyup', keyHandler);

})();
