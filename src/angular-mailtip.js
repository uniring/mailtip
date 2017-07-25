angular.module('mailtip').directive('mailtip', function () {
    return {
        restrict: 'A',
        scope: {
            mailtipDomains: "@domains"
        },
        link: function(scope, element) {
            var config = {
                onSelected: function() {
                    element.change();
                }
            };
            if (scope.mailtipDomains.split(',').length > 0) {
                config.mails = scope.mailtipDomains.split(',');
            }
            element.mailtip(config);
        }
    }
})