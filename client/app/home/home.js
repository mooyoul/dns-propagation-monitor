const
  angular = require('angular');

angular.module('dns.propagation.monitor.app')
.config(($stateProvider) => {
  $stateProvider.state('home', {
    url: '',
    controller: 'HomeCtrl',
    template: require('./home.jade')
  });
});

require('./home.controller');
