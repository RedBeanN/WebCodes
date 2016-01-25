var userApp = angular.module('userApp', ['ngRoute']);
var blogApp = angular.module('blogApp', ['ngRoute', 'ngSanitize', 'am.paging', 'userApp']);

// markdown editor setting
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

blogApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index',
      controller: IndexCtrl
    }).
    when('/addPost', {
      templateUrl: 'partials/addPost',
      controller: AddPostCtrl
    }).
    when('/readPost/:id', {
      templateUrl: 'partials/readPost',
      controller: ReadPostCtrl
    }).
    when('/editPost/:id', {
      templateUrl: 'partials/editPost',
      controller: EditPostCtrl
    }).
    when('/deletePost/:id', {
      templateUrl: 'partials/deletePost',
      controller: DeletePostCtrl
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);

blogApp.controller('mdCtrl', ['$scope', function($scope) {
  if(!$scope.form.text) $scope.form.text = '';
}]).directive('tab', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('keydown', function (event) {
        var keyCode = event.keyCode || event.which;
        if (keyCode === 9) {
          event.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
          element.val(element.val().substring(0, start) 
              + '\t' + element.val().substring(end));
          this.selectionStart = this.selectionEnd = start + 1;
          element.triggerHandler('change');
        }
      });
      scope.$watch('form.text', function(current) {
        if (typeof(current) != 'object') scope.outputText = marked(current);
      });
    }
  };
});

/*userApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'user/user',
      controller: UserIndexController
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);*/

userApp.directive('amUser', [function() {
    return {
    restrict: 'EA',
    templateUrl: 'user/user',
    replace: true,
    scope: {
      config: '='
    }
  }
}]);