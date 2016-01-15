function IndexCtrl($scope, $http) {
  if (!$scope.pagingConfig) $scope.pagingConfig = {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
    onChange: function() {
      console.log('onchange');
      var postpack = $scope.pagingConfig;
      $http.post('/api/postpage', postpack).
        success(function(data) {
          $scope.pagingConfig = data.config;
          $scope.posts = data.posts;
        });
    }
  };
/*  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });*/
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

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
      $scope.form.text = $scope.form.text.join('\n');
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

userApp.controller('clickCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  $scope.showLogin = function() {
    showWaiting($scope);
    $http.get('/api/index').
      success(function(data) {
        $('#userpage').fadeOut(0);
        $scope.pagename = '登录';
        $scope.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.showRegist = function() {
    showWaiting($scope);
    $http.get('/api/regist').
      success(function(data) {
        $('#userpage').fadeOut(0);
        $scope.pagename = '注册';
        $scope.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.post = function(op) {
    if (op == 'logout') {
      //$scope.showLogin();
      UserIndexController($scope, $timeout)
    } else if (op == 'reset') {
      for (var key in $scope.items.lines) {
        $scope.items.lines[key].value = '';
      }
    } else if (op) {
      var ops = $scope.items.operations;
      var user = [];
      $scope.items.operations = [];
      $scope.items.waiting = true;
      for(var key in $scope.items.lines) {
        user[key] = {
          title: $scope.items.lines[key].title,
          value: $scope.items.lines[key].value
        };
      }
      $http.post('api/' + op, user).
        success(function(data) {
          $('#userpage').fadeOut(0);
          $scope.pagename = '详情';
          $scope.items = data;
          $('#userpage').fadeIn(500);
        }).
        error(function(err) {
          $timeout(function(){
            $scope.items.operations = ops;
            $scope.items.waiting = false;
          }, 500);
        })
    }
  };
  $scope.checkValidation = function() {
    var it = {type: this.line.title, value: this.line.value};
    check(it);
  };
  $scope.removeErr = function() {
    changeErr(getID(this.line.title), 0);
  };
}]);

function showWaiting($scope) {
  $scope.pagename = '';
  $scope.items = {};
  $scope.items.waiting = true;
}

function UserIndexController($scope, $timeout) {
  showWaiting($scope);
  $timeout(function() {
    $scope.items.data = [
      {message: '游客，请点击上方按钮登录或注册'}
    ];
    $scope.items.waiting = false;
    bindClick();
  }, 500);
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

angular.bootstrap(document.getElementById('user-bar'), ['userApp']);
angular.bootstrap(document.getElementById('right'), ['blogApp']);