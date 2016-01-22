var userApp = angular.module('userApp', ['ngRoute']);
var blogApp = angular.module('blogApp', ['ngRoute', 'ngSanitize']);

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
        scope.outputText = marked(current);
      });
    }
  };
}).directive('amPaging', [function() {
  return {
  restrict: 'EA',
  templateUrl: 'partials/paging',
  replace: true,
  scope: {
    config: '='
  },
  link: function(scope, ele, attr) {
    scope.changePage = function(pagenum) {
      if (pagenum > 0) scope.config.currentPage = pagenum;
    };

    function getPaging(newValue, oldValue) {
      scope.config.currentPage = parseInt(scope.config.currentPage) ? parseInt(scope.config.currentPage) : 1;
      scope.config.totalItems = parseInt(scope.config.totalItems) ? parseInt(scope.config.totalItems) : 0;
      scope.config.itemsPerPage = parseInt(scope.config.itemsPerPage) ? parseInt(scope.config.itemsPerPage) : 10;
      scope.config.totalPages = Math.ceil(scope.config.totalItems/scope.config.itemsPerPage);
      // if there are to many pages, show up to 10 pages only
      scope.pages = [];
      if (scope.config.totalPages > 9) {
        scope.pages.push(1);
        if (scope.config.currentPage > scope.config.totalPages - 5) {
          // show as: 1   ... 93  94  95  96  97  *98 99
          scope.pages.push('...');
          for (var i = 6; i > 0; i--) {
            scope.pages.push(scope.config.totalPages - i);
          }
        }else if (scope.config.currentPage > 5) {
          // show as: 1   ... 15  16  *17 18  19  ... 99
          scope.pages.push('...');
          for (var i = -2; i <= 2; i++) {
            scope.pages.push(scope.config.currentPage + i);
          }
          scope.pages.push('...');
        } else {
          // show as: 1   2   3   4   5   6   7   ... 99
          for(var i = 2; i < 8; i++) {
            scope.pages.push(i);
          }
          scope.pages.push('...');
        }
        scope.pages.push(scope.config.totalPages);
      } else {
        //   show as: 1   2   3   4   5   6   7
        for(var i = 1; i <= scope.config.totalPages; i++) {
          scope.pages.push(i);
        }
      }
      if (scope.config.onChange) {
        if(!(oldValue != newValue && oldValue[0] == 0)) scope.config.onChange();
      }
      scope.$parent.config = scope.config;
    }

    scope.firstPage = function() {
      if (scope.config.currentPage > 1) scope.config.currentPage = 1;
    }
    scope.prevPage = function() {
      if (scope.config.currentPage > 1) scope.config.currentPage -= 1;
    }
    scope.nextPage = function() {
      if (scope.config.currentPage < scope.config.totalPages) scope.config.currentPage += 1;
    }
    scope.lastPage = function() {
      if (scope.config.currentPage < scope.config.totalPages) scope.config.currentPage = scope.config.totalPages;
    }
    scope.pageJumping = function() {
      scope.jumpTo = parseInt(scope.jumpTo);
      if (scope.jumpTo > 0 && scope.jumpTo <= scope.config.totalPages) {
        scope.config.currentPage = scope.jumpTo;
      }
    }
    scope.setItemsPerPage = function() {
      scope.itemsPerPage = parseInt(scope.itemsPerPage);
      if (scope.itemsPerPage > 0) scope.config.itemsPerPage = scope.itemsPerPage;
    }

    scope.$watch(function() {
      if (!scope.config) scope.config = {};
      if (!scope.config.totalItems) scope.config.totalItems = 0;
      return (scope.config.totalItems + ' ' +  scope.config.currentPage + ' ' + scope.config.itemsPerPage);
    }, getPaging);
  }
}
}]);

userApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'user/user',
      controller: UserIndexController
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);
