angular.module('MobileAngular1.services.Players', [
    'LocalStorageModule'
])

.factory('playerService', ["$rootScope", "localStorageService", function($rootScope, localStorageService){
    var playerData = localStorageService.get("players") || [];

    return  {
        getData: function () {
            return this.cleanData(playerData);
        },
        setData: function (newPlayerData) {
            playerData = this.cleanData(newPlayerData);
        },
        cleanData: function (playerData) {
            return playerData.filter(function(x){
                return (typeof x.value !== ('undefined' || 'null' || 'NaN') && x.value !== (false || undefined || null || NaN || ''));
            });
        }
    };
}]);