'use strict';

/* Services */

blogApp.service('blogService', function () {
  var posts, currentPaginConfig;
  this.getPostPage = function ($scope, $http, config) {
    $('#loading-container').fadeIn(200);
    $http.put('/api/postpage', config).
      success(function (data) {
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
        $('#loading-container').fadeOut(0);
      });
  };
  this.readPost = function ($scope, $http, $routeParams, $location, $timeout) {
    $('#loading-container').fadeIn(200);
  $http.get('/api/post/' + $routeParams.id).
    success(function (data) {
      $scope.form = data.post;
      $scope.form.text = marked(data.post.text.join('\n'));
      $scope.form.comments = data.post.comments;
      $scope.form.comments.waiting = false;
      for (var key in $scope.form.comments) {
        if (key == 'waiting') break;
        $scope.form.comments[key].id = key;
      }
      $('#loading-container').fadeOut(0);
      $scope.addComment = function () {
        $scope.form.comments.waiting = true;
        $scope.form.comments.onerror = false;
        if (!!$scope.form.comments.commentToAdd) {
          var comment = {
            author: 'guest',
            text: $scope.form.comments.commentToAdd
          };
          $('#loading-container').fadeIn(200);
          $http.put('/api/add-comment/' + $scope.form.id, comment).
            success(function (data) {
              $timeout(function () {
                $scope.form.comments.commentToAdd = '';
                $scope.form.comments.push(data);
                $scope.form.comments[$scope.form.comments.length - 1].isAuthor
                  =$scope.form.comments[$scope.form.comments.length - 1].author != 'guest';
                $scope.form.showAddComment = false;
                $scope.form.comments.waiting = false;
                $('#loading-container').fadeOut(0);
              }, 1000);
            }).
            error(function (err) {
              $scope.form.comments.waiting = false;
              $scope.form.comments.onerror = true;
              alert(err);
              $scope.form.comments.errmsg = '连接出错，请稍后重试';
            })
        } else {
          $scope.form.comments.waiting = false;
          $scope.form.comments.onerror = true;
          $scope.form.comments.errmsg = '评论内容不能为空！';
        }
      };
      $scope.addReply = function (pid, cid) {
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
          $('#loading-container').fadeIn(200);
          $http.put('/api/add-reply', toPut).
            success(function (data) {
              if (!$scope.form.comments[cid].replys) $scope.form.comments[cid].replys = [];
              $scope.form.comments[cid].replys.push(data);
              $scope.form.comments[cid].replys[$scope.form.comments[cid].replys.length - 1].id
                = $scope.form.comments[cid].replys.length - 1;
              $scope.form.comments[cid].replys[$scope.form.comments[cid].replys.length - 1].isAuthor
                = $scope.form.comments[cid].replys[$scope.form.comments[cid].replys.length - 1].author != 'guest';
              $scope.form.comments[cid].replys[$scope.form.comments[cid].replys.length - 1].root = true;
              $scope.form.comments[cid].replyAt = $scope.form.comments[cid].replyToAdd = '';
              $scope.form.comments[cid].showReply = false;
              $('#loading-container').fadeOut(0);
            }).error(function (err) {
              console.log(err);
            })
        }
      };
      $scope.deleteComment = function (id) {
        $('#loading-container').fadeIn(200);
        $http.put('/api/delete-comment', {pid: $scope.form.id, cid: id}).
          success(function (data) {
            $scope.form.comments.splice(id, 1);
            $('#loading-container').fadeOut(0);
          }).error(function (err) {console.log(err);})
      };
      $scope.hideComment = function (id) {
        $('#loading-container').fadeIn(200);
        $http.put('/api/hide-comment', {pid: $scope.form.id, cid: id}).
          success(function (data) {
            for (var key in $scope.form.comments) {
              if (key == 'waiting') break;
              $scope.form.comments[key].text = data[key].text;
              $scope.form.comments[key].hiddenByAdmin = data[key].hiddenByAdmin;
              $('#loading-container').fadeOut(0);
            }
          }).
          error(function (err) {
            console.log(err);
          });
      };
      $scope.deleteReply = function (cid, rid) {
        $('#loading-container').fadeIn(200);
        $http.put('/api/delete-reply', {pid: $scope.form.id, cid: cid, rid: rid}).
          success(function (data) {
            $scope.form.comments[cid].replys.splice(rid, 1);
            $('#loading-container').fadeOut(0);
          }).error(function (err) {console.log(err);})
      };
      $scope.hideReply = function (cid, rid) {
        $('#loading-container').fadeIn(200);
        $http.put('/api/hide-reply', {pid: $scope.form.id, cid: cid, rid: rid}).
          success(function (data) {
            for (var key in $scope.form.comments[cid].replys) {
              if (key == 'waiting') break;
              $scope.form.comments[cid].replys[key].text = data[key].text;
              $scope.form.comments[cid].replys[key].hiddenByAdmin = data[key].hiddenByAdmin;
              $('#loading-container').fadeOut(0);
            }
          }).
          error(function (err) {
            console.log(err);
          });
      }
    });
  }
  this.editPost = function ($scope, $http, $location, $routeParams) {
    $('#loading-container').fadeIn(200);
    $http.get('/api/post/' + $routeParams.id).
      success(function (data) {
        console.log(data.hiddenByAdmin);
        if (data.post.hiddenByAdmin) {
          $('#loading-container').fadeOut(0);
          $location.url('/');
        }
        $scope.form = data.post;
        $scope.form.text = $scope.form.text.join('\n');
        $('#loading-container').fadeOut(0);
      });
    $scope.editPost = function () {
      $('#loading-container').fadeIn(200);
      $http.put('/api/post/' + $routeParams.id, $scope.form).
        success(function (data) {
          console.log($routeParams.id);
          $('#loading-container').fadeOut(0);
          $location.url('/readPost/' + $routeParams.id);
        }).error(function (err) {alert(err)});
    };
  }

  this.getPosts = function () { return posts; }
  this.getPagingConfig = function () { return currentPaginConfig; }
})