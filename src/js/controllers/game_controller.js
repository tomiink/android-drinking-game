angular.module('DrinkingGame.controllers.Game', [
   'DrinkingGame.services.Players',
   'DrinkingGame.services.PhraseData'
])

.controller("gameController", ["$scope", "mainService", "playerService", "phraseDataService", "$interpolate", function($scope, mainService, playerService, phraseDataService, $interpolate) {

   var currentIndex, currentPlayer, currentPhrase;

   $scope.init = function() {
      currentIndex = -1;
      currentPlayer = -1;
      currentPhrase = {};

      $scope.phrasePrefix = "&hellip;";
      $scope.players = playerService.getData();
      $scope.gamePack = phraseDataService.getGameMode();
      $scope.gamePack.phraseModifiers = phraseDataService.getPhraseModifiers();
      $scope.gamePack.settings = mainService.mergeArray(phraseDataService.getSettings(), ($scope.gamePack.settings));
      $scope.gamePack.settings.phraseDelayMin = $scope.players.length;

      $scope.phraseQueue = [];

      /*
      $scope.phrase = {phrase: "Start game", actor: "anonyme", type: "normal"};
      $scope.phraseList = [
         {phrase: "Everyone drinks 5 sips! (anon, normal)", actor: "anonyme", type: "normal"},
         {phrase: "{{player}} drinks 20 sips! (player, normal)", actor: "player", type: "normal"},
         {phrase: "This is a 3rd question (anon, virus)", actor: "anonyme", type: "virus"},
         {phrase: "{{player}} This is a 4rd question (player, virus)", actor: "player", type: "virus"},
         {phrase: "This is a 5rd question (anon, normal)", actor: "anonyme", type: "normal"},
         {phrase: "{{player}} This is a 6rd question (player, normal)", actor: "player", type: "normal"},
         {phrase: "EThis is a 7rd question (anon, normal)", actor: "anonyme", type: "normal"},
      ];
      */
   }

   /*
   $scope.changePlayer = function() {
      if($scope.players.length > 0){
         currentPlayer = (currentPlayer+1 <= $scope.players.length-1)?currentPlayer+1:0;
         $scope.player = $scope.players[currentPlayer].value;
      }else{
         currentPlayer = -1
         $scope.player = '';
      }
   };

   $scope.showNext = function() {
      $scope.changePlayer();
      var chosen = false;
      while(currentIndex < $scope.phraseList.length-1){
         currentIndex++;
         var phrase = $scope.phraseList[currentIndex];
         if(phrase.actor == "player"){
            phrase.phrase = $scope.phrasePrefix+$interpolate(phrase.phrase)($scope);
            $scope.showPhrase(phrase);
            chosen = true;
            break;
         }
      };
      if(chosen == false){
         $scope.endGame();
      }
   };

   $scope.endGame = function() {
      $scope.init();
      $scope.phrase.header = "END OF THE GAME";
      $scope.phrase.phrase = "Start again";
   }

   $scope.showPhrase = function(phraseData) {
      $scope.phrase = phraseData
      $scope.phrase.header = phraseData.type
      $scope.phrase.phrase = phraseData.phrase;
      $scope.phrase.player = $scope.player;
   }
   */

   $scope.getRandomDelay = function(){
      var min = $scope.gamePack.settings.phraseDelayMin;
      var max = $scope.gamePack.settings.phraseDelayMax;
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   $scope.prepareGame = function() {

      var originalLog = console.log
      console.log=function(obj){
          originalLog(JSON.parse(JSON.stringify(obj)))
      }

      var refinePhraseData = function(phraseData){
         var newPhraseData = [];
         var checkCount = 0;

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

         //console.log(newPhraseData);

         for (var x in newPhraseData){
            var line = newPhraseData[x];

            if(line.length >= 2 && line[1].includes('d')){
               checkCount++;
               newPhraseData.splice(x, 1);
               line[1] = line[1].replace(/d/g, '');


               newPhraseData.splice(Number(x) + $scope.getRandomDelay(), 0, line);
            }
         }

         //console.log(newPhraseData);
         return (checkCount > 0)?refinePhraseData(newPhraseData):newPhraseData;
         return newPhraseData;
      };

      $scope.phraseQueue = refinePhraseData($scope.gamePack.phraseData);

      //console.log($scope.phraseQueue);
   };

   $scope.showNext = function() {
      if($scope.phraseQueue.length == 0){
         $scope.prepareGame();

         console.log($scope.phraseQueue);

      }else{
         var phrase = $scope.phraseQueue.shift();
         $scope.phrase = {};
         $scope.phrase.phrase = phrase[0];
      }
   };

   $scope.init();
   //$scope.showPhrase();
   $scope.showNext();
}]);
