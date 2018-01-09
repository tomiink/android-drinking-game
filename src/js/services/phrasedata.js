angular.module('DrinkingGame.services.PhraseData', [
   'LocalStorageModule'
])

.factory('phraseDataService', ["$rootScope", "localStorageService", function($rootScope, localStorageService){
   var phraseData = {
      settings: {
         deletethiskey: true,
         phraseDelayMin: 5,
         phraseDelayMax: 15,
         phrasePrefix: "&hellip;",
      },
      phraseModifiers: {
         e: "End of the current game",
         n: "Normal",
         v: "Virus",
         r: "Rule",
         d: "Delayed",
      },
      gameModes: [
         {
            title: "Ensimmäinen peli",
            description: "Tässä on ensimmäisen pelin kuvaus",
            imageUrl: "http://via.placeholder.com/250/?text=1.",
            settings: {
               gameId: 0,
               deletethiskeytoo: true,
               phraseDelayMin: 5,
               phraseDelayMax: 10,
            },
            phraseData: [
               ["Question 0, Player: {{player}}, Normal", "n"],
               [
                  ["Delayed rule 0.1!", "r"], ["Rule cancelled 0.2!", "nd"]
               ],
               [
                  ["Delayed rule 1.1!", "r"], ["Rule cancelled 1.2!", "nd"],
                  [
                     ["Rule cancelled 2.1!", "nd"], ["Rule cancelled 2.2!", "nd"],
                     [
                        ["Rule cancelled 3.1!", "nd"], ["Rule cancelled 3.2!", "nd"]
                     ]
                  ]
               ],
               ["Question 1, Player: {{player}}, Normal", "n"],
               ["Question 2, Player: {{player}}, Virus", "v"],
               ["Question 3, Player: {{player}}, Rule", "r"],
               ["Question 4, No player, Normal", "n"],
               ["Question 5, No player, Virus", "v"],
               ["Question 6, No player, Rule", "r"],
            ]
         },
         {
            title: "Toinen peli",
            description: "Tässä on toisen pelin kuvaus",
            imageUrl: "http://via.placeholder.com/250/?text=2.",
            settings: {
               gameId: 1,
            },
            phraseData: [
               ["Question 0, Player: {{player}}, Normal", "n"],
               [["Delayed rule!", "r"], ["Rule cancelled!", "nd"]],
               ["Question 1, Player: {{player}}, Normal", "n"],
               ["Question 2, Player: {{player}}, Virus", "v"],
               ["Question 3, Player: {{player}}, Rule", "r"],
               ["Question 4, No player, Normal", "n"],
               ["Question 5, No player, Virus", "v"],
               ["Question 6, No player, Rule", "r"],
            ]
         },
      ],
   };

   return {
      getData: function(){
         return phraseData;
      },
      getGameModeList: function (){
         var gameModes = [];
         phraseData.gameModes.forEach(function(mode) {
            //delete mode.phraseData;
            gameModes.push(mode);
         });
         return gameModes;
      },
      gameModeExists: function(id){
         return (typeof id !== 'undefined' && id < phraseData.gameModes.length)?true:false;
      },
      getGameMode: function(id){
         if (this.gameModeExists(id)){
            var gameData = phraseData.gameModes[id];
            gameData.gameId = id;
            gameData.phraseModifiers = phraseData.phraseModifiers;
            gameData.settings = this.mergeArray(phraseData.settings, gameData.settings);
            return gameData;
         }
         return false;
      },
      // General functions
      mergeArray: function(dest, src) {
         for (var key in src)
            if (src.hasOwnProperty(key))
               dest[key] = src[key];
         return dest;
      }


      /*
      getPhraseData: function (){
         return phraseData;
      },
      selectGameMode: function(id){
         localStorageService.set('gameModeId', id);
         selectedGameMode = id;
      },

      // Game mode
      setGameMode: function(id){
         if(this.gameModeExists()){
            selectedGameMode = id;
            localStorageService.set("gameModeId", id);
            return true;
         }
         return false;
      },

      // Phrase data
      getPhraseData: function(id){
         if (typeof id === 'undefined') id = selectedGameMode;
         return (id < phraseData.gameModes.length)?phraseData.gameModes[id].phraseData:false;
      },

      // Game mode names
      getPhraseModifiers: function(){
         return phraseData.phraseModifiers;
      },

      // Settings
      getSettings: function(){
         return phraseData.settings;
      }
      */
   };
}]);
