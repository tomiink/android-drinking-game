angular.module('DrinkingGame.controllers.Mode', [
   'DrinkingGame.services.PhraseData'
])

.controller("modeController", ["$scope", "phraseDataService", function($scope, phraseDataService) {

   $scope.init = function() {
      $scope.gameModes = phraseDataService.getGameModes();
   };
   $scope.selectGameMode = function(selection) {
      phraseDataService.selectGameMode(selection);
   };

   $scope.init();

}]);
