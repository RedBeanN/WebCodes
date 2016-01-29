var MA = angular.module('MA', ['ngRoute']);
MA.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'login',
      controller: IndexCtrl
    }).
    when('/users', {
      templateUrl: 'users',
      controller: UserCtrl
    }).
    when('/student', {
      templateUrl: '/partials/student',
      controller: StudentCtrl
    }).
    // when('/homwork/:id', {
    //   templateUrl: 'partials/homework',
    //   controller: HomeworkCtrl
    // }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);

