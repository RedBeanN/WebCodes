var mongoose = require('mongoose'),
      models = require('./models'),
      Promise = require('bluebird'),
      bcrypt = require('bcryptjs'),
      salt = bcrypt.genSaltSync(10);

var replySchema = models.replySchema,
      commentSchema = models.commentSchema,
      postSchema = models.postSchema,
      userSchema = models.userSchema;

var db = mongoose.createConnection('localhost', 'data');
db.on('error', console.error.bind(console, 'connection error: '));

var replyModel = db.model('replyModel', replySchema);
var commentModel = db.model('commentModel', commentSchema);
var postModel = db.model('postModel', postSchema);
var userModel = db.model('userModel', userSchema);

// create Admin user if isn't exist
userModel.find({username: 'administrator'}).then(function (data) {
  if (!data.length) {
    (new userModel({
      username: 'administrator',
      password: bcrypt.hashSync('blogAdmin', salt),
      number: 14333341,
      phone: 12345654321,
      email: 'admin@local.host',
      root: 'administrator'
    })).save();
    console.log('[Mongoose] Admin does not exist. Create admin account.\nYour username is [administrator], password is [blogAdmin].');
  } else {
    console.log('[Mongoose] Admin exists.');
  }
});

postModel.count().then(function (count) {
  console.log('[Mongoose] ' + (count? 'Find ' + count + ' post(s).' : 'Cannot find any post!'));
});

// User operations
exports.registUserToDB = function (user) {
  return userModel.find().
    then(function (users) {
      var errmsg = [];
      for (var key in users) {
        var checkKeys = ['username', 'phone', 'number', 'email'];
        for (var attr in checkKeys) {
          if (users[key][checkKeys[attr]] == user[checkKeys[attr]]) errmsg.push(getUniqueErrorMessage(checkKeys[attr]));
        }
      }
      if (errmsg.length) return Promise.reject(errmsg.join('\n'));
      else {
        var usr = new userModel(user);
        usr.password = bcrypt.hashSync(usr.password, salt);
        if (!usr.nickname) user.nickname = usr.username;
        usr.save();
        return Promise.resolve(usr);
      }
    });
}
exports.checkUserInDB = function (username, password) {
  return userModel.find({username: username}).
    then(function (data) {
      if (!data) return Promise.reject('Cannot Found User: ' + username);
      else {
        if (bcrypt.compareSync(password, data[0].password)) return Promise.resolve(data[0]);
        else return Promise.reject('Password error');
      }
    })
}
exports.getUser = function (username) {
  return userModel.find({username: username}).
    then(function (user) {
      if (!user.length) return Promise.reject('Cannot Find User');
      else return Promise.resolve(user[0]);
    })
}
exports.getUserRoot = function (username) {
  return userModel.find({username: username}).
    then(function (data) {
      if (!data.length) return Promise.resolve(false);
      else return Promise.resolve(data[0].root == 'administrator');
    })
}

// Post operations
exports.getPostById = function (id) {
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= id) return Promise.reject('Cannot Find Post');
      else if (posts[id].hiddenByAdmin) {
        var hiddenPost = posts[id];
        hiddenPost.text = ['`该内容已被管理员隐藏。`'];
        return Promise.resolve(hiddenPost);
      }
      else return Promise.resolve(posts[id]);
    })
}
exports.getPostsByConfig = function (conf, username, isRootUser) {
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (!posts.length) return Promise.reject('No Post Exist');
      else {
        // update paging config
        conf.totalItems = posts.length;
        conf.totalPages = Math.ceil(conf.totalItems / conf.itemsPerPage);
        if (conf.currentPage > conf.totalPages) return Promise.reject('Error Page Number');
        // push posts
        var page = [];
        for (var i = (conf.currentPage - 1) * conf.itemsPerPage;
              i <= conf.currentPage * conf.itemsPerPage - 1; i++) {
          if (i >= conf.totalItems) break;
          var post = posts[i].toJSON();
          if (!posts[i].hiddenByAdmin) post.text = post.text[0].length > 50 ?
            post.text[0].substr(0, 50) + '...' : post.text[0];
          else post.text = '该内容已被管理员隐藏。';
          post.id = i;
          post.isAuthor = (post.author == username || (post.author == 'guest' && isRootUser));
          post.root = isRootUser;
          page.push(post);
        }
        return Promise.resolve(page);
      }
    })
}
exports.pushPostIntoDB = function (data, author) {
  author = author ? author : 'guest';
  var post = new postModel(data);
  post.author = author;
  post.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  post.save();
  return Promise.resolve(true);
}
exports.removePostFromDB = function (id, username, isRootUser) {
  return postModel.find().sort({'_id': -1}).
    then(function (post) {
      if (post[id].author == username || isRootUser) {
        return postModel.remove({_id: post[id]._id}).
          then(function (data) {
            return Promise.resolve(true);
          })
      } else return Promise.reject(false);
    })
}
exports.updatePostInDB = function (id, username, isRootUser, option, change) {
  if (option == 'edit') {
    return postModel.find().sort({'_id': -1}).then(function (post) {
      if (post[id].author == username || post[id].author == 'guest') {
        post[id].title = change.title;
        post[id].text = change.text;
        // post[id].id = id;
        post[id].date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
        post[id].save();
        return Promise.resolve(true);
      } else return Promise.reject('非作者不能修改博客');
    })
  } else if (option == 'hide') {
    if (isRootUser) {
      return postModel.find().sort({'_id': -1}).then(function (posts) {
        posts[id].hiddenByAdmin = !posts[id].hiddenByAdmin;
        posts[id].save();
        return Promise.resolve(true);
      })
    } else return Promise.reject('非管理员不能隐藏博客');
  }
}
exports.pushCommentIntoPost = function (postid, comment) {
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= postid) return Promise.reject('找不到指定的文章');
      var nid = posts[postid].comments.length;
      posts[postid].comments.push(comment);
      posts[postid].save();
      comment.root = true;
      comment.id = nid;
      return Promise.resolve(comment);
    })
}
exports.pushReplyIntoComment = function (postid, commentid, reply) {
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= postid) return Promise.reject('找不到指定的文章');
      if (posts[postid].comments.length <= commentid) return Promise.reject('找不到指定的评论');
      posts[postid].comments[commentid].replys.push(reply);
      posts[postid].save();
      return Promise.resolve(reply);
    })
}
exports.removeCommentFromPost = function (postid, commentid, username) {
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= postid) return Promise.reject('找不到指定的文章');
      if (posts[postid].comments.length <= commentid) return Promise.reject('找不到指定的评论');
      if (posts[postid].comments[commentid].author != username
          && username != 'administrator') return Promise.reject('你没有删除评论的权限！');
      posts[postid].comments.splice(commentid, 1);
      posts[postid].save();
      return Promise.resolve(posts[postid].comments);
    })
}
exports.removeReplyFromComment = function (postid, commentid, replyid, username) {
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= postid) return Promise.reject('找不到指定的文章');
      if (posts[postid].comments.length <= commentid) return Promise.reject('找不到指定的评论');
      if (posts[postid].comments[commentid].replys.length <= replyid) return Promise.reject('找不到指定的回复');
      if (posts[postid].comments[commentid].replys[replyid].author != username
          && username != 'administrator')
        return Promise.reject('非作者不能删除回复');
      posts[postid].comments[commentid].replys.splice(replyid, 1);
      posts[postid].save();
      return Promise.resolve(posts[postid].comments[commentid].replys);
    })
}
exports.hideComment = function (postid, commentid, root) {
  if (!root) return Promise.reject('只有管理员可以隐藏评论');
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= postid) return Promise.reject('找不到指定的文章');
      if (posts[postid].comments.length <= commentid)  return Promise.reject('找不到指定的评论');
      posts[postid].comments[commentid].hiddenByAdmin = !posts[postid].comments[commentid].hiddenByAdmin;
      posts[postid].save();
      return Promise.resolve(posts[postid].comments);
    })
}
exports.hideReply = function (pid, cid, rid, root) {
  if (!root) return Promise.reject('只有管理员可以隐藏回复');
  return postModel.find().sort({'_id': -1}).
    then(function (posts) {
      if (posts.length <= pid) return Promise.reject('找不到指定的文章');
      if (posts[pid].comments.length <= cid) return Promise.reject('找不到指定的评论');
      if (posts[pid].comments[cid].replys.length <= rid) return Promise.reject('找不到指定的回复');
      posts[pid].comments[cid].replys[rid].hiddenByAdmin = !posts[pid].comments[cid].replys[rid].hiddenByAdmin;
      posts[pid].save();
      return Promise.resolve(posts[pid].comments[cid].replys);
    })
}

function getUniqueErrorMessage(key) {
  var msg;
  switch(key) {
    case 'username': msg = '用户名'; break;
    case 'number': msg = '学号'; break;
    case 'phone': msg = '电话'; break;
    case 'email': msg = '邮箱'; break;
  }
  msg += '已被注册。';
  return msg;
}

exports.templates = models.templates;