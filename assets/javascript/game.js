

//split by newline (\n) and replace each line starting from top... join with newlines
// top line must be full length

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
//ui screen is 19 characters high
//ui screen is 73 characters wide

// "You Win/Lose" statement should be 9 characters wide
// body sections should be 5 characters wide

//word should be maximum 14 characters

var body = [
" ,;, ",
"<span class=\"blinking-eyes\"><span class=\"open\">('_')</span><span class=\"closed\">(-_-)</span></span>",
"  |  ",
" /M\\ ",
"/ H \\",
"  X  ",
" / \\ ",
"/   \\",
"     ",
] 

body = {
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
   
   /*normal: [
   " ,;, ",
   "<span class=\"blinking-eyes\"><span class=\"open\">('_')</span><span class=\"closed\">(-_-)</span></span>",
   "  |  ",
   " /M\\ ",
   "/ H \\",
   "  X  ",
   " / \\ ",
   "/   \\",
   "     ",
   ],*/
   hair: " ,;, ",
   heads: {
      normal: "<span class=\"blinking-eyes\"><span class=\"open\">('_')</span><span class=\"closed\">(-_-)</span></span>",
      happy: "(^_^)",
      sad: "(-,-)",
   },
   neck: "  |  ",
   torso: {
      upper: ["  M  ", " /M  ", " /M\\ "],
      lower: ["  H  ", "/ H  ", "/ H \\"]
   },
   hips: "  X  ",
   legs: {
      upper: [" /   ", " / \\ "],
      lower: ["/    ", "/   \\"]
   }
}
//    (-_-)     ('_') > (o_o) > (-‸-) > (x‸x)    (-‸-) <sad when miss


var winText = '<span class="blinking-text">You Win! </span>   Play Again? (y/n)';
var loseText = '<span class="blinking-text">You Lose!</span>   Play Again? (y/n)';

var endGameOK = '             OK.             '
var endGame = '            Wait.            '

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




const wordList = ['Simpsons', 
                'Looney Tunes', 
                'South Park',
                'Family Guy',
                'The Smurfs',
               ];



//hangman will start new instance of game object.
//game object will have a gameEnd method which uses...
//a callback function with an argument value that...
// represents whether the game has been won 'hasWon' 

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

   this.callback = callback;



   console.log('game');
   console.log(word);
   //callback(false);
}

//guess a letter
game.prototype.guess = function(letter) {
   //if guessed letter has not been guessed,
   //add the letter to our guessed letters and proceed
   if( this.guessedLetters.indexOf(letter) === -1){

      //disable input until animations finish
      //and store gussed letter
      this.ui.setWait(this);
      this.guessedLetters.push(letter);

      //find all indices of guessed letter and push...
      //index value(s) to indices array
      let indices = [];
      for(let i = 0; i < this.wordArr.length; i++){
         if( letter === this.wordArr[i]){
            indices.push(i);
         }
      }

      //if letter is found in our word,
      //update word as seen by user 
      if( indices.length ){
         indices.forEach((i) => {
            this.userArr[i] = this.word[i];
         });
         var goodGuess = true;
      }
      //otherwise reduce guesses left by one,
      //push letter to misses, and update hangman,
      else{
         this.guessesLeft -= 1;
         this.misses.push(letter);
         goodGuess = false;
      }


      console.log(...this.userArr);
      console.log(...this.misses);

      //check for win
      if(this.userArr.join('') === this.word){
         this.isFinished = true;
         this.win = true;
         this.wins += 1;
         console.log('winnar');
      } 
      //check for loss
      else if( this.guessesLeft === 0){
         this.isFinished = true;
         this.win = false;
         this.losses += 1;
         console.log('loser');
      }

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

//updates visual user interface
//element arg is the DOM element to use for UI
function ui(element, callback){
   element.innerHTML = blankScreen;
   this.homeScreen = homeScreen.split('\n');
   this.hangmanScreen = hangmanScreen.split('\n');
   setTimeout( this.changeScreen.bind(this, 0, this.homeScreen, callback, 150));
   element.innerHTML = blankScreen;
   console.log(element);
   console.log('ui');
}
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
ui.prototype.updateWord = function(game){
   document.getElementById('word').innerHTML = game.userArr.join(' ');
}
ui.prototype.updateMisses = function(game){
   document.getElementById('misses').innerHTML = game.misses.join(', ');
}
//updates both wins and losses
ui.prototype.updateWins = function(game){
   document.getElementById('wins').innerHTML = game.wins;
   document.getElementById('losses').innerHTML = game.losses;
}
//updates body parts
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
ui.prototype.setWin = function(game){
   document.getElementById('end-game').innerHTML = winText;
   game.ready = true; 
}
ui.prototype.setLoss = function(game){
   document.getElementById('end-game').innerHTML = loseText;
   game.ready = true; 
}
//update interface when user chose right letter
ui.prototype.goodChoice = function(game){
   //happy face (if guesses left is <= 5,
   //update word,
   //normal face, (if guesses left is <= 5),
   //back to ready
   var ready = () => {
      if (game.guessesLeft <=5){
         this.updateBody(1, body.heads.normal);
      }
      if( game.isFinished ){
         //animate more
         //change guy to dance 
         this.updateWins(game);
         this.setWin(game);
      }
      else{
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
   //sad face (if guesses left is < 5,
   //update misses,
   //normal face, (if guesses left is < 5),
   //update limb,
   //back to ready,
   this.updateMisses(game);
   this.setReady(game);
   switch(game.guessesLeft){
      case 5:
         this.updateBody(0, body.hair);
         this.updateBody(1, body.heads.normal);
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
   if( game.isFinished ){
      this.updateWins(game);
      this.setLoss(game);
   }
}

//updatebody
//finish game


const hangman = {
   //when true, pressing any key starts new game
   //is set true after page is loaded and animations finish
   ready: false,

   //copy words array, so it can be reset
   words: wordList.slice(0),
   wins: 0,
   losses: 0,

   //stores current active game
   //set null after game over (before new game)
   currentGame: null,

   //user interface object

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
      //reset data
      else{
         callback = function(){this.ready = true }.bind(this);
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
      let word = this.words[randint(0, len - 1)];
      this.words.splice(this.words.indexOf(word), 1);
      this.currentGame = new game(word, 
                                  this.ui, 
                                  this.wins,
                                  this.losses,
                                  this.gameFinished.bind(this)
                                 );
      this.ui.changeScreen(0, 
                           this.ui.hangmanScreen, 
                           this.ui.initGame.bind(this.ui, this.currentGame)
                          );
   }
}
hangman.ui = new ui(document.getElementById('ui'), () => {hangman.ready = true });

//returns random integer, inclusive 
function randint(min, max) {
   return min + Math.floor(Math.random() * (max - min + 1));
}

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
   //if current game has finished, y/n keys will...
   //either start a new game or go back to home screen
   else if(game.isFinished && game.ready){
      if( keyCode === 89){
         game.playAgain(true);
      }
      else if( keyCode === 78){
         game.playAgain(false);
      }
   }
   //if current game exists and is ready for input,
   //
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
















//    ,,,      ,,,       ,,,     ,,,     ,,,     ,,,      ,,,
//   (^_^)    (-_-)     ('_') > (o_o) > (-‸-) > (x‸x)    (-‸-) <sad when miss
//
//
//           (^_^)
//           \/|\_
//               
//   regular eyes could be spans with before/after content that animates
//
//
//  blinking text can be done with spans and animation. 
//
//
//
//
//
//
//                   You Lose!  Play Again? (y/n)
//
//          
//          
//         [++]=====[+]
//          ||       |
//          ||      ,;, 
//          ||     ('_')
//          ||       |
//          ||      /M\\             word: _ _ _ _ _   _ _ _ _ _ _ _ _ _ _ 
//          ||     / H \\       
//          ||       X              misses: a, d, f, 
//         /++\\     / \\              b, g, h, r, y, u, i,
//        //||\\\\   /   \\
//       // || \\\\                   wins: 0
// =========================================================================
//          
//          
//         [++]=====[+]
//          ||       |
//          ||      ,;, 
//          ||     ('_')            last guess: g
//          ||       |
//          ||      /M\             word: _ _ _ _ _   _ _ _ _
//          ||     / H \       
//          ||       X              misses: a, d, f, 
//          ||      / \
//         /++\    /   \              b, g, h, r, y, u, i,
//        //||\\      
//       // || \\                   wins: 0
// =============================================================
//
//
//         flash>  You Lose!  Play Again? (y/n)
//
//          
//          
//         [++]=====[+]
//          ||       |
//          ||       |
//          ||      ,;, 
//          ||     (x‸x)
//          ||       |
//          ||      /M\             word: _ _ _ _ _   _ _ _ _
//          ||      \H/       
//          ||       X              misses: a, d, f, 
//         /++\     | |              b, g, h, r, y, u, i,
//        //||\\    | |
//       // || \\                   wins: 0        losses: 
// =============================================================
//
//
/*


 [++]=======================[++]
  ||                         ||
  ||      H A N G M A N      ||
  ||                         ||
  ||  Press any key to play  ||   <flash this line
  ||                         ||
 [++]=======================[++]



*/
