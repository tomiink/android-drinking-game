angular.module('MobileAngular1.controllers.Player', [])

.directive('onResume', function() {
    return {
        restrict: 'A',
        scope: {
            onResume: '&'
        },
        link: function(scope, elem, attr, ctrl) {
            elem.bind('resume', function(e) {
                scope.$apply(function() {
                    scope.onResume();
                });
            });
        }
    };
});