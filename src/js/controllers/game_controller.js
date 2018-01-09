angular.module('DrinkingGame.controllers.Game', [
   'DrinkingGame.services.Players',
   'DrinkingGame.services.Game'
])

.controller("gameController", ["$scope", "mainService", "playerService", "gameService", "$interpolate", function($scope, mainService, playerService, gameService, $interpolate) {

   var currentIndex, currentPlayer, currentPhrase;

   $scope.init = function() {
      currentIndex = -1;
      currentPlayer = -1;
      currentPhrase = {};

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
   /*
   $scope.showNext = function() {

      console.log(phraseDataService.getGameMode());

      if($scope.phraseQueue.length == 0){
         $scope.prepareGame();

         //console.log($scope.phraseQueue);
         $scope.showNext();

      }else{
         var phrase = $scope.phraseQueue.shift();
         $scope.phrase = {};
         $scope.phrase.phrase = phrase[0];
      }
   };

   $scope.init();
   //$scope.showPhrase();
   $scope.showNext();
   */

   $scope.showPhrase = function(phrase){
      $scope.phrase = {};
      if(phrase[1].includes('e')) console.log("END OF THE GAME!");
      $scope.phrase.phrase = phrase[0];
   };

   $scope.showNext = function(){
      $scope.showPhrase(gameService.getNextPhrase());
   };

   gameService.initGame();
   $scope.showPhrase(gameService.getCurrentPhrase());

   /*
   TODO: Peli alkamaan alusta jos pelaajia vaihdetaan?
   */
}]);
