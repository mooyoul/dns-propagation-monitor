const angular = require('angular');

angular.module('dns.propagation.monitor.component.resource')
.factory('Lookup', ($resource) => $resource('/api/lookup', {}, {
  query: {
    isArray: false
  }
}));
