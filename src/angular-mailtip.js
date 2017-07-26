angular.module('mailtip', [])
    .directive('mailtip', function (mailtipConfig) {
        return {
            restrict: 'A',
            scope: {
                domains: "@mailtipDomains"
            },
            link: function(scope, element) {
                // Apply config provider configuration.
                var config = mailtipConfig.getAll();

                // Find if loaded config has an onSelected callback and save it.
                var onSelectedCallback = false;
                if (typeof config.onSelected == 'function') {
                    onSelectedCallback = config.onSelected;
                }

                // Redefine onSelected callback to add needed logic to it before the actual user's callback.
                config.onSelected = function() {
                    // Trigger field 'change' event when the user selects an option.
                    element.change();
                    if (onSelectedCallback) {
                        onSelectedCallback();
                    }
                }

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
