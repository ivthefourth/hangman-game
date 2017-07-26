
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

function game(word, ui, wins, callback){
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

   this.ui.initNewGame(this);



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
      `this.ready = false;`
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
      //update word as seen by user and
      if( indices.length ){
         indices.forEach((i) => {
            this.userArr[i] = this.word[i];
         });
      }
      //otherwise reduce guesses left by one,
      //push letter to misses, and update hangman,
      else{
         this.guessesLeft -= 1;
         this.misses.push(letter);
      }


      console.log(...this.userArr);
      console.log(...this.misses);

      //check for win
      if(this.userArr.join('') === this.word){
         this.isFinished = true;
         this.win = true;
         console.log('winnar');
      } 
      //check for loss
      else if( this.guessesLeft === 0){
         this.isFinished = true;
         this.win = false;
         console.log('loser');
      }

      //this.ui.update(letter, wasinword??, this);
   }
};

//start a new game or back to home screen
//answer true to play again, false to return home
game.prototype.playAgain = function(answer) {
   this.callback(answer, this.win);
};


function ui(){
   console.log('ui');
}
ui.prototype.initNewGame = function(game) {
   // delete later, this should happen after animations
   game.ready = true;
};


const hangman = {
   //when true, pressing any key starts new game
   //is set true after page is loaded and animations finish
   ready: false,

   //copy words array, so it can be reset
   words: wordList.slice(0),
   wins: 0,

   //stores current active game
   //set null after game over (before new game)
   currentGame: null,

   //user interface object
   ui: new ui(),

   //callback from game when game is over
   //prepares this object for a new game
   gameFinished: function(playAgain, hasWon) {
      //track wins
      if( hasWon ){
         this.wins += 1;
      }
      //start a new game if they want to play again
      if(playAgain){
         this.startNewGame();
      }
      //back to homescreen if they dont want to play again
      else{
         this.ready = false;
         this.currentGame = null;
         this.wins = 0;
         this.words = wordList.slice(0);
         //update ui to home 
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
                                  this.gameFinished.bind(this)
                                 );
   }
}

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
   else if(game.isFinished){
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



//remove later just for dev
function go(){
   hangman.ready = true;
}

//    ,,,      ,,,       ,,,     ,,,     ,,,     ,,,
//   (^_^)    (-_-)     ('_') > (o_o) > (-‸-) > (x‸x)   
//
//
//           (^_^)
//            /|\_
//
//
//
//
//
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
//       // || \\                   wins: 0
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
