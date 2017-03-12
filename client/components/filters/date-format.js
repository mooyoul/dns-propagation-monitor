const angular = require('angular');
const moment = require('moment');

angular.module('dns.propagation.monitor.component.filter')
.filter('dateFormat', () => (date, format) => {
  if (!date) { return ''; }

  return moment(date).format(format || 'YYYY-MM-DD HH:mm:ss');
});
