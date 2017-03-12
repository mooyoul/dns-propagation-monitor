const angular = require('angular');
const Promise = require('bluebird');

angular.module('dns.propagation.monitor.app')
.controller('HomeCtrl', ($scope, CONFIG, Lookup) => {
  $scope.servers = angular.copy(CONFIG.servers);
  $scope.targets = angular.copy(CONFIG.targets);

  const getKey = $scope.getKey = (target, server) => `${target.host}_${target.rrtype.toLowerCase()}_${server.host}`;

  $scope.fetchOne = (target, server) => {
    return Lookup.query({
      host: target.host,
      rrtype: target.rrtype,
      dns: server.host
    }).$promise.then((result) => {
      $scope.results[getKey(target, server)] = result;
    }).catch((e) => {
      console.error(e);
      $scope.results[getKey(target, server)] = e.data;
    });
  };


  $scope.fetchAll = () => {
    $scope.results = {};
    $scope.targets.forEach((target) => {
      $scope.servers.forEach((server) => {
        $scope.fetchOne(target, server);
      });
    });
  };


  $scope.fetchAll();
});
