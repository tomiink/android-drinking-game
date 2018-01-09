angular.module('DrinkingGame.controllers.Mode', [
   'DrinkingGame.services.Game'
])

.controller("modeController", ["$scope", "gameService", function($scope, gameService) {

   $scope.init = function() {
      $scope.gameModes = gameService.getGameModeList();
   };
   $scope.selectGameMode = function(selection) {
      gameService.setGameMode(selection);
   };

   $scope.init();

}]);
