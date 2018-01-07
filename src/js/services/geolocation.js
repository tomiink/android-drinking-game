angular.module('MobileAngular1.services.Geolocation', [
    'MobileAngular1.services.Cordova'
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