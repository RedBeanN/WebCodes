function IndexCtrl ($scope, $http, $location) {
  $scope.form = {};
  $http.get('users/detail').
    success(function (data) {
      $location.url('/' + data.targetUrl);
    });
  $scope.login = function () {
    var user = {};
    user.username = $scope.form.username;
    user.password = $scope.form.password;
    user.remember = $scope.form.remember;
    if (user.username && user.password) {
      $http.post('/user/login', user).
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
  $http.get('user/detail').
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
        $scope.notifications = data.notifications;
        $scope.hasRead = data.hasRead;
      }
    }).error(function (err) {
      alert(err);
    });
  $scope.logout = function () {
    $http.get('logout').
      success(function (data) {
        $templateCache.removeAll();
        $location.url('/');
      }).
      error(function (err) {
        $templateCache.removeAll();
        $location.url('/');
      });
  };
  $scope.read = function () {
    // console.log($scope);
    $scope.hasRead = true;
    $http.get('/user/read-notifications').
      success(function (data) {
        console.log(data);
      }).
      error(function (err) {
        alert(err);
      });
  };
}

function PswCtrl ($scope, $http, $location) {
  if ($scope.form.newPassword != $scope.form.repeatPassword) {
    alert('Please Input Password Correctly!');
  } else {
    $http.post('user/changePassword', $scope.form).
      success(function (data) {
        console.log(data);
      }).
      error(function (err) {
        alert(err);
      });
  }
}