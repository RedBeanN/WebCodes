var isIdentityChanged = 'no';

function IndexCtrl($scope, $http, blogService) {
  $('#loading-container').fadeOut(0);
  if (!$scope.pagingConfig) $scope.pagingConfig = {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 5,
    onChange: function () {
      isIdentityChanged = 'no';
      var postpack = $scope.pagingConfig;
      blogService.getPostPage($scope, $http, postpack);
    }
  };
  $scope.$watch(function () { return isIdentityChanged; }, $scope.pagingConfig.onChange);
}

function AddPostCtrl ($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $scope.form.text = $scope.form.text.split('\n');
    $http.post('/api/post', $scope.form).
      success(function (data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl ($scope, $http, $location, $routeParams, $timeout, blogService) {
  $scope.form = {};
  //blogService.readPost($scope, $http, $routeParams, $location, $timeout);
  $scope.$watch(function () { return isIdentityChanged; }, function () {
    blogService.readPost($scope, $http, $routeParams, $location, $timeout);
  });
}

function EditPostCtrl ($scope, $http, $location, $routeParams, blogService) {
  $scope.form = {};
  blogService.editPost ($scope, $http, $location, $routeParams);
}

function DeletePostCtrl ($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $('#loading-container').fadeIn(200);
  $http.get('/api/post/' + $routeParams.id).
    success(function (data) {
      console.log(data);
      $scope.form = data.post;
      $scope.form.text = marked(data.post.text.join('\n'));
      $('#loading-container').fadeOut(0);
    }).
    error(function (err) {console.log('err');});

  $scope.deletePost = function () {
    $('#loading-container').fadeIn(200);
    $http.delete('/api/post/' + $routeParams.id).
      success(function (data) {
        $location.url('/');
        $('#loading-container').fadeOut(0);
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

function HidePostCtrl ($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $('#loading-container').fadeIn(200);
  $http.get('/api/post/' + $routeParams.id).
    success(function (data) {
      $scope.form = data.post;
      $scope.form.hiddenByAdmin = data.post.hiddenByAdmin;
      $scope.form.text = marked(data.post.text.join('\n'));
      $('#loading-container').fadeOut(0);
    });

  $scope.hidePost = function () {
    $('#loading-container').fadeIn(200);
    $http.get('/api/hide-post/' + $routeParams.id).
      success(function (data) {
        $('#loading-container').fadeOut(0);
        $location.url('/');
      }).
      error(function (err) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

blogApp.controller('clickCtrl', ['$scope', '$http', '$timeout', 'blogService', function ($scope, $http, $timeout, blogService) {
  if (!$scope.config) $scope.config = {};
  $scope.config.items = {
    waiting: false,
    isLogin: false,
    welcome: 'welcome'
  }
  UserIndexController($scope, $http, $timeout);
  $scope.config.showLogin = function () {
    if ($scope.config.items.waiting) return;
    showWaiting($scope);
    $http.get('/api/login').
      success(function (data) {
        $('#userpage').fadeOut(0);
        $scope.config.pagename = '登录';
        $scope.config.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.config.showRegist = function () {
    if ($scope.config.items.waiting) return;
    showWaiting($scope);
    $http.get('/api/regist').
      success(function (data) {
        $('#userpage').fadeOut(0);
        $scope.config.pagename = '注册';
        $scope.config.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.config.post = function (op) {
    if (op == 'logout') {
      $http.get('api/logout').
        success(function () {
          isIdentityChanged = 'yes';
          UserIndexController($scope, $http, $timeout)
        })
    } else if (op == 'reset') {
      for (var key in $scope.config.items.lines) {
        $scope.config.items.lines[key].value = '';
      }
    } else if (op) {
      var isInvalid = false;
      for (var key in $scope.config.items.lines) {
        isInvalid += $scope.config.checkValidation($scope.config.items.lines[key]);
      }
      if (isInvalid && op != 'login') return;
      var ops = $scope.config.items.operations;
      var user = [];
      $scope.config.items.operations = [];
      $scope.config.items.waiting = true;
      for(var key in $scope.config.items.lines) {
        user[key] = {
          'title': $scope.config.items.lines[key].title,
          'value': $scope.config.items.lines[key].value
        };
      }
      $http.post('api/' + op, user).
        success(function (data) {
          if (data.isLogin) {
            $scope.config.items = {};
            $scope.config.items.welcome = (op == 'login' ?
              '登录成功，欢迎回来！' : '注册成功，正在自动登录。');
            $timeout(function () {
              $('#userpage').fadeOut(0);
              $scope.config.pagename = '用户详情';
              $scope.config.items = data;
              $('#userpage').fadeIn(500);
            }, 1000)
            isIdentityChanged = true;
          } else {
            $timeout(function (){
              $scope.config.items.operations = ops;
              $scope.config.items.data = data.data;
              $scope.config.items.waiting = false;
            }, 500);
          }
        }).
        error(function (err) {
          $timeout(function (){
            $scope.config.items.data = err.data;
            $scope.config.items.operations = ops;
            $scope.config.items.waiting = false;
          }, 500);
        });
    }
  };
  $scope.config.checkValidation = function (val) {
    var it = {type: val.title, value: val.value};
    return !check(it);
  };
  $scope.config.removeErr = function (val) {
    changeErr(validator.getID(val.title), 0);
  };
}]);

function showWaiting($scope) {
  $scope.config.pagename = '';
  $scope.config.items = {};
  $scope.config.items.waiting = true;
}

function UserIndexController($scope, $http, $timeout) {
  showWaiting($scope);
  $http.get('/api/index').
    success(function (data) {
      $scope.config.items = data;
      if ($scope.config.items.isLogin) $scope.config.pagename = '用户详情';
      bindClick();
    });
}

function bindClick() {
  if (isBinded) return;
  $('.login').click(function () {
    $('.login').addClass('user-active');
    $('.regist').removeClass('user-active');
  });
  $('.regist').click(function () {
    $('.regist').addClass('user-active');
    $('.login').removeClass('user-active');
  });
  isBinded = true;
}
var isBinded = false;

angular.bootstrap(document.getElementById('body'), ['blogApp']);