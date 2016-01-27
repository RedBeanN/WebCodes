var db = require('../db/db');
var Promise = require('bluebird');

var validator = require('../public/js/validator.js'),
    cookieMaxAge = 24 * 60 * 60 * 1000,
    _timeout = 500;

var templates = db.templates;

// GET
exports.post = function (req, res) {
  var id = req.params.id;
  db.getUserRoot(req.cookies.username).then(function (root) {
    db.getPostById(id).then(function (data) {
      var post = { post: data.toJSON() };
      post.post.id = id;
      post.post.root = root;
      for (var key in post.post.comments) {
        post.post.comments[key].isAuthor = 
          (post.post.comments[key].author == req.cookies.username
            || (post.post.comments[key].author == 'guest' && root));
        post.post.comments[key].id = key;
        if (post.post.comments[key].hiddenByAdmin) post.post.comments[key].text = '该内容已被管理员隐藏。';
        for (var rep in post.post.comments[key].replys) {
          post.post.comments[key].replys[rep].isAuthor = 
            (post.post.comments[key].replys[rep].author == req.cookies.username
              || (post.post.comments[key].replys[rep].author == 'guest' && root));
          post.post.comments[key].replys[rep].id = rep;
          if (post.post.comments[key].replys[rep].hiddenByAdmin) post.post.comments[key].replys[rep].text = '该内容已被管理员隐藏。';
        }
      }
      setTimeout(function () {res.json(post);}, _timeout);
      
    }, function (err) {
      console.log(err);
      res.status(500).json(err);
    });
  });
};

exports.hidePost = function (req, res) {
  var id = req.params.id, username = req.cookies.username;
  db.getUserRoot(username).then(function (root) {
    var isRootUser = root;
    db.updatePostInDB(id, username, isRootUser, 'hide').
      then(function (data) {
        res.send(data);
      }, function (err) {
        res.status(500).send(err);
      });
  })
}

// POST
exports.addPost = function (req, res) {
  db.pushPostIntoDB(req.body, req.cookies.username).then(function () {
    res.json(true);
  });
};

exports.postPage = function (req, res) {
  // res.json(getPostPage(req.body, req.cookies.username));
  setTimeout(function () {
    getPostPage(req.body, req.cookies.username).then(function (data) {
      res.json(data);
    })
  }, _timeout);

}

// PUT
exports.editPost = function (req, res) {
  var id = req.params.id;
  db.updatePostInDB(id, req.cookies.username, false, 'edit', {
    title: req.body.title,
    text: req.body.text
  }).then(function (data) {
    // console.log('update ' + (data ? 'succeeded.' : 'failed'));
    res.json(data);
  }, function (error) {
    res.status(500).json(error);
  });
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;
  if (!req.cookies.username) res.json(false);
  db.getUserRoot(req.cookies.username).then(function (root) {
    db.removePostFromDB(id, req.cookies.username, root).
      then(function (data) { res.json(data); })
  });

};

exports.getIndex = function (req, res) {
  if (req.cookies.username) {
    // res.json(getDetailPage(req.cookies.username));
    db.getUser(req.cookies.username)
      .then(function (data) {
        res.json(getDetailPage(data));
      }, function (err) {
        res.cookie('username', 'guest', {maxAge: -1});
        res.json({
          welcome: '游客，请点击上方按钮登录或注册。',
          waiting: false,
          isLogin: false
        });
      });
  } else {
    var items = {
      welcome: '游客，请点击上方按钮登录或注册。',
      waiting: false,
      isLogin: false
    };
    res.cookie('username', 'guest', {maxAge: -1});
    res.json(items);
  }
}

exports.logout = function (req, res) {
  res.cookie('username', '', {maxAge: -1});
  res.json(true)
}

exports.getLogin = function (req, res) {
  var loginPage = templates.login;
  setTimeout(function () {
    res.json(loginPage);
  }, _timeout);
};

exports.getRegist = function (req, res) {
  setTimeout(function () {
    res.json(templates.regist);
  }, _timeout);
};

exports.login = function (req, res) {
  db.checkUserInDB(req.body[0].value, req.body[1].value).
    then(function (data) {
      res.cookie('username', data.username, {maxAge: cookieMaxAge});
      res.json(getDetailPage(data));
    }, function (err) {
      res.json({
          data: ['用户名或密码不正确。'],
          waiting: false,
          isLogin: false
        })
    });
};

exports.regist = function (req, res) {
  try {
    var user = parseUser(req.body);
    checkUser(user);
    user.root = 'user';
    db.registUserToDB(user).
      then(function (user) {
        res.cookie('username', user.username, {maxAge: cookieMaxAge});
        res.json(getDetailPage(user));
      }, function (error) {
        res.status(500).json({
          data: error.split('\n'),
          waiting: false,
          isLogin: false
        })
      });
  } catch(err) {
    res.json({
      data: err.message.split('\n'),
      waiting: false,
      isLogin: false
    })
  }
}

exports.addComment = function (req, res) {
  var id = req.params.id;
  req.body.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  if (req.cookies.username) req.body.author = req.cookies.username;
  db.pushCommentIntoPost(id, req.body).
    then(function (data) {
      res.json(data);
    }, function (err) {
      res.status(500).json(err);
    })
}
exports.addReply = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid;
  var reply = req.body.reply;
  if (req.cookies.username) req.body.reply.author = req.cookies.username;
  reply.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  db.pushReplyIntoComment(pid, cid, reply).
    then(function (data) {
      res.json(data);
    }, function (err) {
      res.status(500).json(err);
    })
}
exports.deleteComment = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid, username = req.cookies.username;
  db.removeCommentFromPost(pid, cid, username).
    then(function (data) {
      res.json(data);
    }, function (err) {
      res.status(500).json(err);
    })
}
exports.hideComment = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid, username = req.cookies.username;
  db.getUserRoot(username).
    then(function (root) {
      db.hideComment(pid, cid, root).
        then(function (data) {
          for (var key in data) if (data[key].hiddenByAdmin) data[key].text = '该内容已被管理员隐藏。';
          res.json(data);
        }, function (err) {
          res.status(500).json(err);
        });
    });
}
exports.deleteReply = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid, rid = req.body.rid, username = req.cookies.username;
  db.removeReplyFromComment(pid, cid, rid, username).
    then(function (data) {
      res.json(data);
    }, function (err) {
      res.status(500).json(err);
    });
}
exports.hideReply = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid, rid = req.body.rid, username = req.cookies.username;
  db.getUserRoot(username).
    then(function (root) {
      db.hideReply(pid, cid, rid, root).
        then(function (data) {
          for (var key in data) if (data[key].hiddenByAdmin) data[key].text = '该内容已被管理员隐藏。';
          res.json(data);
        }, function (err) {
          console.log(err);
          res.status(500).json(err);
        });
    });
}

function getPostPage (conf, username) {
  return db.getUserRoot(username).
    then(function (root) {
      return db.getPostsByConfig(conf, username, root).then(function (page) {
        return Promise.resolve({config: conf, posts: page});
      });
    })
}
function getDetailPage (user) {
  var item = {
    detail: [
      {message: '用户名: ' + user.username},
      {message: '学　号: ' + user.number},
      {message: '邮　箱: ' + user.email},
      {message: '电　话: ' + user.phone},
      {message: '用户组: ' + (user.root=='administrator' ? '管理员' : '普通用户')}
    ],
    operations: [
      {value: '退出', type: 'submit', title: 'logout', id: 'submit'}
    ],
    username: user.username,
    root: (user.root == 'administrator'),
    waiting: false,
    isLogin: true
  };
  return item;
}

// functions
function parseUser (body) {
  var user = {};
  user.username = body[0].value;
  user.password = body[1].value;
  user.repeat = body[2].value;
  user.number = body[3].value;
  user.email = body[4].value;
  user.phone = body[5].value;
  return user;
}

function checkUser (user) {
  var errMsg = [];
  var pw = user['password'];
  for (var key in user) {
    var _key = getChinese(key);
    if (!user[key]) errMsg.push(_key + '错误： ' + validator.form[key].errorMessage);
    else if (!validator.isFieldValid(key, user[key], pw)) errMsg.push(_key + ': ' + validator.form[key].errorMessage);
  }
  if (errMsg.length > 0) throw new Error(errMsg.join('\n'));
}


function getChinese (key) {
  var msg;
  switch(key) {
    case 'username': msg = '用户名'; break;
    case 'number': msg = '学号'; break;
    case 'password': msg = '密码'; break;
    case 'repeat': msg = '重复密码'; break;
    case 'phone': msg = '电话'; break;
    case 'email': msg = '邮箱'; break;
  }
  return msg + '';
}
