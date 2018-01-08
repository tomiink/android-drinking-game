angular.module('DrinkingGame.services.Forecast', [])

.factory('getWeather', ["$http", function($http){
    return function(lat, lng, done) {
        $http({method: 'GET', url: 'http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lng+'&APPID=31ff1ee5ab763c15d4c55c9047a0f89d'})
        .then(function successCallback(response) {
            done(response.data.name, response.data.weather[0].description);
        }, function errorCallback(response) {
            throw new Error('Unable to get weather');
        });
    };
}]);
