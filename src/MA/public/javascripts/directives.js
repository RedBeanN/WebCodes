angular.module('MA').
  directive('navbar', function () {
    return {
      restrict: 'A',
      templateUrl: '/nav',
      replace: true
    };
  });