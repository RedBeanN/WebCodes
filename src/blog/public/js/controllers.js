var isIdentityChanged = 'no';

function IndexCtrl($scope, $http, blogService) {
  if (!$scope.pagingConfig) $scope.pagingConfig = {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
    onChange: function() {
      isIdentityChanged = 'no';
      var postpack = $scope.pagingConfig;
      blogService.getPostPage($scope, $http, postpack);
    }
  };
  $scope.$watch(function() { return isIdentityChanged; }, $scope.pagingConfig.onChange);
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $scope.form.text = $scope.form.text.split('\n');
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $location, $routeParams, $timeout, blogService) {
  $scope.form = {};
  blogService.readPost($scope, $http, $routeParams, $location, $timeout);
  $scope.$watch(function() { return isIdentityChanged; }, function() {
    blogService.readPost($scope, $http, $routeParams, $location, $timeout);
  });
}

function EditPostCtrl($scope, $http, $location, $routeParams, blogService) {
  $scope.form = {};
  blogService.editPost($scope, $http, $location, $routeParams);
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
      $scope.form.text = marked(data.post.text.join('\n'));
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      }).
      error(function(err) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

blogApp.controller('clickCtrl', ['$scope', '$http', '$timeout', 'blogService', function($scope, $http, $timeout, blogService) {
  if (!$scope.config) $scope.config = {};
  $scope.config.items = {
    waiting: false,
    isLogin: false,
    welcome: 'welcome'
  }
  UserIndexController($scope, $http, $timeout);
  $scope.config.showLogin = function() {
    if ($scope.config.items.waiting) return;
    showWaiting($scope);
    $http.get('/api/login').
      success(function(data) {
        $('#userpage').fadeOut(0);
        $scope.config.pagename = '登录';
        $scope.config.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.config.showRegist = function() {
    if ($scope.config.items.waiting) return;
    showWaiting($scope);
    $http.get('/api/regist').
      success(function(data) {
        $('#userpage').fadeOut(0);
        $scope.config.pagename = '注册';
        $scope.config.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.config.post = function(op) {
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
        success(function(data) {
          if (data.isLogin) {
            console.log(blogService.getPosts());
            $scope.config.items = {};
            $scope.config.items.welcome = 'Log in success, welcome.';
            $timeout(function() {
              $('#userpage').fadeOut(0);
              $scope.config.pagename = '用户详情';
              $scope.config.items = data;
              $('#userpage').fadeIn(500);
            }, 1000)
            isIdentityChanged = true;
          } else {
            $timeout(function(){
              $scope.config.items.operations = ops;
              $scope.config.items.data = data.data;
              $scope.config.items.waiting = false;
            }, 500);
          }
        }).
        error(function(err) {
          $timeout(function(){
            $scope.config.items.operations = ops;
            $scope.config.items.waiting = false;
          }, 500);
        });
    }
  };
  $scope.checkValidation = function() {
    var it = {type: this.line.title, value: this.line.value};
    check(it);
  };
  $scope.removeErr = function() {
    changeErr(validator.getID(this.line.title), 0);
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
  $('.login').click(function() {
    $('.login').addClass('active');
    $('.regist').removeClass('active');
  });
  $('.regist').click(function() {
    $('.regist').addClass('active');
    $('.login').removeClass('active');
  });
  isBinded = true;
}

var isBinded = false;

//angular.bootstrap(document.getElementById('user-bar'), ['userApp']);
//angular.bootstrap(document.getElementById('right'), ['blogApp']);
angular.bootstrap(document.getElementById('body'), ['blogApp']);