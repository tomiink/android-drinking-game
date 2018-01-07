angular.module('MobileAngular1.controllers.Main', [
    'MobileAngular1.services.Geolocation',
    'MobileAngular1.services.Forecast'
])

.controller('MainController', ["$scope", "getCurrentPosition", "getWeather", function($scope, getCurrentPosition, getWeather){
    try {
        getCurrentPosition(function(position){
            getWeather(position.coords.latitude, position.coords.longitude, function(location, weather){
                var positionData;
                for(var propName in position['coords']) {
                    positionData += propName+': '+position['coords'][propName]+', '
                }
                
                $scope.positionData = positionData;
                $scope.location = location;
                $scope.weather = weather;
            });
        });
    } catch(e) {
        window.error = e;
        console.error(e);
    }
}]);
