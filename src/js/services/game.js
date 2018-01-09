angular.module('DrinkingGame.services.Game', [
   'LocalStorageModule',
   'DrinkingGame.services.Players',
   'DrinkingGame.services.PhraseData'
])

.factory('gameService', ["$rootScope", "localStorageService", "playerService", "phraseDataService", function($rootScope, localStorageService, playerService, phraseDataService){
   var gameModeId = localStorageService.get("gameModeId") || 0;
   var phraseDump = [];
   var phraseQueue = [];
   var gameData = {};

   return {
      // Select game mode
      getGameModeList: function (){
         return phraseDataService.getGameModeList();
      },
      gameModeExists: function(id){
         return phraseDataService.gameModeExists(id);
      },
      setGameMode: function(id){
         if(this.gameModeExists(id)){
            gameModeId = id;
            localStorageService.set("gameModeId", id);
            return true;
         }
         return false;
      },
      // Is game running?
      getGameHash: function() {
         // https://gist.github.com/ivanperelivskiy/4110988
         var makeHash = function(s) {
             var a = 1, c = 0, h, o;
             if (s) {
                 a = 0;
                 for (h = s.length - 1; h >= 0; h--) {
                     o = s.charCodeAt(h);
                     a = (a<<6&268435455) + o + (o<<14);
                     c = a & 266338304;
                     a = c!==0?a^c>>21:a;
                 }
             }
             return String(a);
         };

         var idString = ("").concat(JSON.stringify(gameData.players), JSON.stringify(gameData.gameId), JSON.stringify(gameModeId), JSON.stringify(gameData.phraseData.length));
         return makeHash(idString);
      },
      gameStarted: function(){
         return (phraseQueue.length > 0 && gameData.gameId === gameModeId && gameData.settings.gameHash === this.getGameHash());
      },
      // Prepare new game
      initGame: function(gameId){
         if (typeof gameId === 'undefined') gameId = gameModeId;
         if (!this.gameStarted()) this.startNewGame();
      },
      startNewGame: function(gameId){
         if (typeof gameId === 'undefined') gameId = gameModeId;

         phraseDump = [];
         phraseQueue = [];
         gameData = {};

         gameData = this.loadGameData(gameId);
         gameData.settings.gameHash = this.getGameHash();
         phraseQueue = this.preparePhraseQueue(gameData);
      },
      loadGameData: function(gameId){
         if (typeof gameId === 'undefined') gameId = gameModeId;
         var gameData = {};

         gameData = phraseDataService.getGameMode(gameId);
         gameData.players = playerService.getData();
         //gameData.settings.phraseDelayMin = gameData.players.length;
         return gameData;
      },
      preparePhraseQueue: function(gameData) {
         var delayMin = gameData.settings.phraseDelayMin;
         var delayMax = gameData.settings.phraseDelayMax;
         var phraseData = gameData.phraseData;

         var getRandomDelay = function(){
            return Math.floor(Math.random() * (delayMax - delayMin + 1)) + delayMin;
         };

         var refinePhraseData = function(phraseData){
            var newPhraseData = [];
            var checkCount = 0;

            // Flatten the phrase array
            for (var x in phraseData){
               var line = phraseData[x];

               if(Array.isArray(line[0])){
                  checkCount++;
                  for (var y in line){
                     newPhraseData.push(line[y]);
                  }
               }else{
                  newPhraseData.push(line);
               }
            }

            // Change position for the delayed questions
            for (var x in newPhraseData){
               var line = newPhraseData[x];

               if(line.length >= 2 && line[1].includes('d')){
                  checkCount++;
                  // Remove current delayed item
                  newPhraseData.splice(x, 1);
                  // Remove delay modificator
                  line[1] = line[1].replace(/d/g, '');
                  // Set item to new position
                  newPhraseData.splice(Number(x) + getRandomDelay(), 0, line);
               }
            }
            return (checkCount > 0)?refinePhraseData(newPhraseData):newPhraseData;
         };
         return refinePhraseData(phraseData);
      },
      // The game started
      getCurrentPhrase: function(){
         return (phraseQueue.length >= 1)?phraseQueue[0]:[gameData.phraseModifiers.e,'e'];
      },
      getNextPhrase: function() {
         if(!this.gameStarted()){
            this.startNewGame();
         }

         phraseDump.push(phraseQueue.shift());
         return this.getCurrentPhrase();
      }



   };

}]);
