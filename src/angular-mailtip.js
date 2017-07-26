angular.module('mailtip', [])
    .directive('mailtip', function (mailtipConfig) {
        return {
            restrict: 'A',
            scope: {
                domains: "@mailtipDomains"
            },
            link: function(scope, element) {
                // Trigger field 'change' event when the user selects an option.
                var config = {
                    onSelected: function() {
                        element.change();
                    }
                };

                // Apply config provider configuration.
                angular.extend(config, mailtipConfig.getAll());

                // If mailtip-domains attribute has values, override domains config with them.
                if (scope.domains && scope.domains.split(',').length > 0) {
                    config.domains = scope.domains.split(',');
                }

                // Run jQuery mailtip plugin on the element with the current config.
                element.mailtip(config);
            }
        }
    })
    .provider('mailtipConfig', function () {
        this.config = [];
        this.$get = function() {
            var config = this.config;
            return {
                get: function(param) {
                    return config[param];
                },
                getAll: function() {
                    return config;
                }
            };
        };
        this.set = function(param, value) {
            this.config[param] = value;
        }
    })
