function IndexCtrl ($scope, $http, $location) {
  $scope.form = {};
  $http.get('users/detail').
    success(function (data) {
      console.log(data);
      $location.url('/' + data.targetUrl);
    });
  $scope.login = function () {
    var user = {};
    user.username = $scope.form.username;
    user.password = $scope.form.password;
    user.remember = $scope.form.remember;
    if (user.username && user.password) {
      $http.post('/users/login', user).
        success(function (data) {
          $location.url('/' + data.targetUrl);
        }).
        error(function (error) {
          alert(error.message);
          $location.url('/');
        });
    }
  };
}
function UserCtrl ($scope, $http) {
  console.log('usr ctr');
  $http.get('users/detail').
    success(function (data) {
      $scope.user = data;
      $scope.data = data.data;
    });
}

function StudentCtrl ($scope, $http, $location, $timeout, $templateCache) {
  $http.get('student/data').
    success(function (data) {
      if (data.targetUrl) $location.url('/');
      else {
        $scope.user = data.user;
        $scope.data = data.data;
      }
    });
  $scope.logout = function () {
    console.log('logout');
    $http.get('logout').
      success(function (data) {
        console.log('logout success');
        $templateCache.removeAll();
        $location.url('/');
      }).
      error(function (err) {
        console.log('logout success');
        $templateCache.removeAll();
        $location.url('/');
      });
  };
}
