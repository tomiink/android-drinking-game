angular.module('DrinkingGame.services.Geolocation', [
    'DrinkingGame.services.Cordova'
])

.factory('getCurrentPosition', ["deviceReady", "$document", "$window", "$rootScope", function(deviceReady, $document, $window, $rootScope){
    return function(done) {
        deviceReady(function(){
            navigator.geolocation.getCurrentPosition(function(position){
                $rootScope.$apply(function(){
                    done(position);
                });
            }, function(error){
                $rootScope.$apply(function(){
                    throw new Error('Unable to retreive position');
                });
            });
        });
    };
}]);
