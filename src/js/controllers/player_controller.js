angular.module('DrinkingGame.controllers.Player', [
    'LocalStorageModule',
    'DrinkingGame.services.Players'
])

.controller("playerController", ["$scope", "localStorageService", "playerService", function($scope, localStorageService, playerService) {

    $scope.init = function() {
        $scope.players = playerService.getData();
    };
    $scope.addNewChoice = function() {
        var newItemNo = $scope.players.length + 1;
        $scope.players.push({'name':'player-'+newItemNo});
    };
    $scope.removeChoice = function() {
        var lastItem = $scope.players.length-1;
        $scope.players.splice(lastItem);
    };
    $scope.cleanArray = function() {
        $scope.players = $scope.players.filter(function(x){
            return (typeof x.value !== ('undefined' || 'null' || 'NaN') && x.value !== (false || undefined || null || NaN || ''));
        });
    };
    $scope.fillBlanks = function() {
        while ($scope.players.length < 3) {
            $scope.addNewChoice();
        }
    };
    $scope.unbind = function() {};
    $scope.bind = function() {
        localStorageService.set('players', $scope.players);
        $scope.unbind = localStorageService.bind($scope, 'players');
    };
    $scope.$watch('players', function(newVal, oldVal) {
        playerService.setData($scope.players);
    }, true);

    $scope.init();
    $scope.cleanArray();
    $scope.fillBlanks();
    $scope.bind();
}]);
