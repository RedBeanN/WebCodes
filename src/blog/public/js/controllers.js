function IndexCtrl($scope, $http) {
  if (!$scope.pagingConfig) $scope.pagingConfig = {
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: 10,
    onChange: function() {
      var postpack = $scope.pagingConfig;
      $http.put('/api/postpage', postpack).
        success(function(data) {
          // update pagingConfig
          $scope.pagingConfig.currentPage = data.config.currentPage;
          $scope.pagingConfig.totalItems = data.config.totalItems;
          $scope.pagingConfig.itemsPerPage = data.config.itemsPerPage;
          $scope.pagingConfig.totalPages = data.config.totalPages;
          $scope.posts = data.posts;
          // markdownize texts
          for (var key in $scope.posts) {
            $scope.posts[key].text = marked($scope.posts[key].text);
          }
        });
    }
  };
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

function ReadPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
      $scope.form.text = marked(data.post.text.join('\n'));
      $scope.form.comments = data.post.comments;
      $scope.addComment = function () {
        if (!!$scope.form.comments.commentToAdd) {
          var comment = {
            author: 'guest',
            text: $scope.form.comments.commentToAdd
          };
          $http.put('/api/add-comment/' + $scope.form.id, comment).
            success(function(data) {
              $scope.form.comments.push(data);
            });
        }
      };
      $scope.deleteComment = function () {
        var toDelete = '/api/delete-comment/'
        + $scope.form.id + '/' + this.id;
        console.log(toDelete);
      }
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
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

userApp.controller('clickCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  $scope.showLogin = function() {
    if ($scope.items.waiting) return;
    showWaiting($scope);
    $http.get('/api/login').
      success(function(data) {
        $('#userpage').fadeOut(0);
        $scope.pagename = '登录';
        $scope.items = data;
        $('#userpage').fadeIn(500);
      });
  };
  $scope.showRegist = function() {
    if ($scope.items.waiting) return;
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
      $http.get('api/logout').
        success(function () {
          UserIndexController($scope, $http, $timeout)
        })
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
          'title': $scope.items.lines[key].title,
          'value': $scope.items.lines[key].value
        };
      }
      $http.post('api/' + op, user).
        success(function(data) {
          if (data.isLogin) {
            $scope.items = {};
            $scope.items.welcome = 'Log in success, welcome.';
            $timeout(function() {
              $('#userpage').fadeOut(0);
              $scope.pagename = '用户详情';
              $scope.items = data;
              $('#userpage').fadeIn(500);
            }, 1000)
          } else {
            $timeout(function(){
              $scope.items.operations = ops;
              $scope.items.data = data.data;
              $scope.items.waiting = false;
            }, 500);
          }
        }).
        error(function(err) {
          $timeout(function(){
            $scope.items.operations = ops;
            $scope.items.waiting = false;
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
  $scope.pagename = '';
  $scope.items = {};
  $scope.items.waiting = true;
}

function UserIndexController($scope, $http, $timeout) {
  showWaiting($scope);
  $http.get('/api/index')./*
  $timeout(function() {
    $scope.items.welcome = '游客，请点击上方按钮登录或注册。';
    $scope.items.waiting = false;
    $scope.items.isLogin = false;
    bindClick();
  }, 500);*/
    success(function (data) {
      $scope.items = data;
      if ($scope.items.isLogin) $scope.pagename = '用户详情';
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

angular.bootstrap(document.getElementById('user-bar'), ['userApp']);
angular.bootstrap(document.getElementById('right'), ['blogApp']);