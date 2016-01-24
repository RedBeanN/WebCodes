angular.module('am.user', []).directive('amUser', [function() {
  console.log('233');
  return {
    restrict: 'EA',
    templateUrl: 'user.html',
    replace: true,
    scope: {
      config: '='
    },
    link: function(scope, ele, attr, $http) {
/*      console.log('1');
      scope.showLogin = function() {
        if (scope.items.waiting) return;
        showWaiting(scope);
        $http.get('/api/login').
          success(function(data) {
            $('#userpage').fadeOut(0);
            scope.pagename = '登录';
            scope.items = data;
            $('#userpage').fadeIn(500);
          });
      };
      scope.showRegist = function() {
        if (scope.items.waiting) return;
        showWaiting(scope);
        $http.get('/api/regist').
          success(function(data) {
            $('#userpage').fadeOut(0);
            scope.pagename = '注册';
            scope.items = data;
            $('#userpage').fadeIn(500);
          });
      };
      scope.post = function(op) {
        if (op == 'logout') {
          $http.get('api/logout').
            success(function () {
              UserIndexController(scope, $http, $timeout)
            })
        } else if (op == 'reset') {
          for (var key in scope.items.lines) {
            scope.items.lines[key].value = '';
          }
        } else if (op) {
          var ops = scope.items.operations;
          var user = [];
          scope.items.operations = [];
          scope.items.waiting = true;
          for(var key in scope.items.lines) {
            user[key] = {
              'title': scope.items.lines[key].title,
              'value': scope.items.lines[key].value
            };
          }
          $http.post('api/' + op, user).
            success(function(data) {
              if (data.isLogin) {
                scope.items = {};
                scope.items.welcome = 'Log in success, welcome.';
                $timeout(function() {
                  $('#userpage').fadeOut(0);
                  scope.pagename = '用户详情';
                  scope.items = data;
                  $('#userpage').fadeIn(500);
                }, 1000)
              } else {
                $timeout(function(){
                  scope.items.operations = ops;
                  scope.items.data = data.data;
                  scope.items.waiting = false;
                }, 500);
              }
            }).
            error(function(err) {
              $timeout(function(){
                scope.items.operations = ops;
                scope.items.waiting = false;
              }, 500);
            });
        }
      };
      scope.checkValidation = function() {
        var it = {type: this.line.title, value: this.line.value};
        check(it);
      };
      scope.removeErr = function() {
        changeErr(validator.getID(this.line.title), 0);
      };*/
      function showWaiting(scope) {
        scope.pagename = '';
        scope.items = {};
        scope.items.waiting = true;
      }
    }
  }
}])