'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
blogApp.service('blogService', function() {
  var posts, currentPaginConfig;
  this.getPostPage = function($scope, $http, config) {
    $http.put('/api/postpage', config).
      success(function(data) {
        // console.log(data);
        $scope.pagingConfig.currentPage = data.config.currentPage;
        $scope.pagingConfig.totalItems = data.config.totalItems;
        $scope.pagingConfig.itemsPerPage = data.config.itemsPerPage;
        $scope.pagingConfig.totalPages = data.config.totalPages;
        $scope.posts = data.posts;
        // for (var key in $scope.posts) {
        //   $scope.posts[key].text = marked($scope.posts[key].text[0]);
        // }
        posts = $scope.posts;
        currentPaginConfig = data.config;
      });
  };
  this.readPost = function ($scope, $http, $routeParams, $location, $timeout) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
      $scope.form.text = marked(data.post.text.join('\n'));
      $scope.form.comments = data.post.comments;
      $scope.form.comments.waiting = false;
      $scope.addComment = function () {
        $scope.form.comments.waiting = true;
        $scope.form.comments.onerror = false;
        if (!!$scope.form.comments.commentToAdd) {
          var comment = {
            author: 'guest',
            text: $scope.form.comments.commentToAdd
          };
          $http.put('/api/add-comment/' + $scope.form.id, comment).
            success(function(data) {
              $timeout(function () {
                $scope.form.comments.commentToAdd = '';
                $scope.form.comments.push(data);
                $scope.form.showAddComment = false;
                $scope.form.comments.waiting = false;
              }, 1000);
            }).
            error(function(err) {
              $scope.form.comments.waiting = false;
              $scope.form.comments.onerror = true;
              $scope.form.comments.errmsg = '连接出错，请稍后重试';
            })
        } else {
          $scope.form.comments.waiting = false;
          $scope.form.comments.onerror = true;
          $scope.form.comments.errmsg = '评论内容不能为空！';
        }
      };
      $scope.addReply = function(pid, cid) {
        console.log(cid);
        console.log($scope.form.comments[cid].replyToAdd);
        if ($scope.form.comments[cid].replyToAdd) {
          var toPut = {
            pid: pid,
            cid: cid,
            reply: {
              text: $scope.form.comments[cid].replyToAdd,
              author: 'guest'
            }
          };
          if ($scope.form.comments[cid].replyAt) toPut.reply.at = $scope.form.comments[cid].replyAt;
          $http.put('/api/add-reply', toPut).
            success(function (data) {
              $scope.form.comments[cid].replys = data;
              $scope.form.comments[cid].replys[$scope.form.comments[cid].replys.length - 1].root = true;
              $scope.form.comments[cid].replyAt = $scope.form.comments[cid].replyToAdd = '';
              $scope.form.comments[cid].showReply = false;
            }).error(function(err) {console.log(err);})
        }
      };
      $scope.deleteComment = function (id) {
        $http.put('/api/delete-comment', {pid: $scope.form.id, cid: id}).
          success(function(data) {
            $scope.form.comments = data;
          }).error(function(err) {console.log(err);})
      };
      $scope.deleteReply = function (cid, rid) {
        $http.put('/api/delete-reply', {pid: $scope.form.id, cid: cid, rid: rid}).
          success(function(data) {
            $scope.form.comments[cid].replys = data;
          })
      };
    });
  }
  this.editPost = function ($scope, $http, $location, $routeParams) {
    $http.get('/api/post/' + $routeParams.id).
      success(function (data) {
        console.log(data.hiddenByAdmin);
        if (data.post.hiddenByAdmin) {
          $location.url('/');
        }
        $scope.form = data.post;
        $scope.form.text = $scope.form.text.join('\n');
      });
    $scope.editPost = function () {
      $http.put('/api/post/' + $routeParams.id, $scope.form).
        success(function (data) {
          console.log($routeParams.id);
          $location.url('/readPost/' + $routeParams.id);
        }).error(function (err) {alert(err)});
    };
  }

  this.getPosts = function () { return posts; }
  this.getPagingConfig = function () { return currentPaginConfig; }
})