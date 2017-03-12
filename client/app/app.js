/**
 * Module dependencies.
 */
const angular = require('angular');
require('bootstrap');

/**
 * Module configurations.
 */

angular.module('dns.propagation.monitor.app', [
  require('angular-resource'),
  require('angular-ui-router'),
  require('../components/index')
]).constant('CONFIG', require('./config'))
.config(($urlMatcherFactoryProvider, $locationProvider, $urlRouterProvider) => {
  $urlMatcherFactoryProvider.strictMode(false);

  $locationProvider.html5Mode({
    enabled: false
  });

  $urlRouterProvider.otherwise(($injector) => {
    const $state = $injector.get('$state');
    $state.go('home');
  });
}).config(($httpProvider) => {
  $httpProvider.useApplyAsync(true);
}).run(($timeout, $rootScope, $state, $stateParams) => {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});


// Global styles
require('bootstrap/dist/css/bootstrap.css');

// Routes
require('./home/home');

