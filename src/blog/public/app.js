// This editor is based on https://github.com/qianjiahao/markdown-editor/

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
angular.module('markdown', ['ngSanitize']).controller('markdownController', ['$scope', function($scope) {
  $scope.inputText = '';
  $scope.$watch('inputText', function(current) {
    $scope.outputText = marked(current);
  })
}]).directive('tab', function () {
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
    }
  }
});