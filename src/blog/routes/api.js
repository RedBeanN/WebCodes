/*
 * Serve JSON to our AngularJS client
 */
var db = require('../db/db');
var Promise = require('bluebird');

var validator = require('../public/js/validator.js'),
    cookieMaxAge = 24 * 60 * 60 * 1000;
var data = {
  posts: [
    {
      title: "Lorem ipsum",
      author: "AUTHOR1",
      deletedByAdmin: false,
      text: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."],
      comments: [
        {
          id: '0',
          author: 'AUTHOR1',
          deletedByAdmin: false,
          text: 'This is text 1',
          at: 'hongshn',
          replys: [
            {
              id: 0,
              author: 'hongshn',
              deletedByAdmin: false,
              text: 'Get.',
              at: 'AUTHOR1'
            },
            {
              id: 1,
              author: 'AUTHOR1',
              deletedByAdmin: false,
              text: 'OK~!',
              at: 'hongshn'
            }
          ],
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
        },
        {
          d: '1',
          author: 'AUTHOR2',
          text: 'This is text 2',
          deletedByAdmin: false,
          replys: [],
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        }
      ],
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    },
    {
      title: "Sed egestas",
      author: "AUTHOR2",
      deletedByAdmin: false,
      text: ["Sed egestas", "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."],
      comments: [],
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
    }
  ],
  users: {
      'hongshn': {
        username: 'hongshn',
        password: 'hsn41432',
        number: '14359047',
        email: 'shnhong@gmail.com',
        phone: '15602404445',
        root: 'administrator'
      },
      'guest': {
        username: 'guest',
        password: undefined,
        number: 10000000,
        email: 'null@hongshn.xyz',
        phone: '13800000000',
        root: 'guest'
      }
    }
};

var templates = {
  login: {
    lines: [
      {title: '用户名', type: 'text'},
      {title: '密　码', type: 'password'}
    ],
    operations: [
      {value: '提交', type: 'submit', title: 'login', id: 'submit'},
      {value: '重置', type: 'reset', title: 'reset', id: 'reset'}
    ],
    waiting: false,
    isLogin: false
  },
  regist: {
    lines: [
      {title: '用户名', type: 'text', id: 'err-username'},
      {title: '密　码', type: 'password', id: 'err-password'},
      {title: '重复密码', type: 'password', id: 'err-repeat'},
      {title: '学　号', type: 'text', id: 'err-number'},
      {title: '邮　箱', type: 'text', id: 'err-email'},
      {title: '电　话', type: 'text', id: 'err-phone'}
    ],
    operations: [
      {value: '注册', type: 'submit', title: 'regist', id: 'submit'},
      {value: '重置', type: 'reset', title: 'reset', id: 'reset'}
    ],
    waiting: false,
    isLogin: false
  }
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0) {
    db.getPostById(id).then(function (data) {
      var post = { post: data };
      post.post.id = id;
      for (var key in post.post.comments) {
        if (post.post.comments[key].author == req.cookies.username || isRootUser(req.cookies.username)) {
          post.post.comments[key].root = true;
        } else post.post.comments[key].root = false;
        for (var rep in post.post.comments[key].replys) {
          if (post.post.comments[key].replys[rep].author == req.cookies.username || isRootUser(req.cookies.username)) {
            post.post.comments[key].replys[rep].root = true;
          } else post.post.comments[key].replys[rep].root = false;
        }
      }
      res.json(post);
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  db.pushPostIntoDB(req.body, req.cookies.username);
  res.json(true);
};

exports.postPage = function (req, res) {
  // res.json(getPostPage(req.body, req.cookies.username));
  getPostPage(req.body, req.cookies.username).then(function (data) {
    res.json(data);
  })
}

// PUT


exports.editPost = function (req, res) {
  var id = req.params.id;
  db.updatePostInDB(id, req.cookies.username, false, 'edit', {
    title: req.body.title,
    text: req.body.text
  }).then(function (data) {
    console.log('update ' + (data ? 'succeeded.' : 'failed'));
    res.json(data);
  }, function (error) {
    res.status(500).json(error);
  });
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;
  if (!req.cookies.username) res.json(false);
  db.removePostFromDB(id, req.cookies.username, isRootUser(req.cookies.username)).
    then(function (data) { res.json(data); })
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
  setTimeout(function() {
    res.json(loginPage);
  }, 500);
};

exports.getRegist = function (req, res) {
  setTimeout(function() {
    res.json(templates.regist);
  }, 500);
};

exports.login = function(req, res) {
  db.checkUserInDB(req.body[0].value, req.body[1].value).
    then(function (data) {
      res.cookie('username', data.username, {maxAge: cookieMaxAge});
      res.json(getDetailPage(data));
    }, function (err) {
      res.json({
          data: ['username or password error'],
          waiting: false,
          isLogin: false
        })
    });
};

exports.regist = function(req, res) {
  try {
    var user = parseUser(req.body);
    checkUser(user);
    user.root = 'user';
    db.registUserToDB(user).
      then(function (user) {
        res.cookie('username', user.username, {maxAge: cookieMaxAge});
        res.json(getDetailPage(user));
      }, function (error) {
        res.json({
          data: error.split('\n'),
          waiting: false,
          isLogin: false
        })
      });
  //   res.cookie('username', user.username, {maxAge: cookieMaxAge});
  //   res.json(getDetailPage(req.body[0].value));
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
  if (id >= 0 && id < data.posts.length) {
    req.body.id = data.posts[id].comments.length;
    req.body.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    if (req.cookies.username) req.body.author = req.cookies.username;
    data.posts[id].comments.push(req.body);
    req.body.root = true;
    res.json(req.body);
  } else res.status(500).send('Post Not Found');
}
exports.addReply = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid;
  if (pid >= 0 && pid < data.posts.length) {
    if (cid >= 0 && cid < data.posts[pid].comments.length) {
      req.body.reply.id = data.posts[pid].comments[cid].replys.length;
      if (req.cookies.username && isUserExist(req.cookies.username)) {
        req.body.reply.author = req.cookies.username;
      }
      req.body.date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
      data.posts[pid].comments[cid].replys.push(req.body.reply);
      res.json(data.posts[pid].comments[cid].replys);
    } else res.status(500).send('Comment Not Found');
  } else res.status(500).send('Post Not Found');
}
exports.deleteComment = function(req, res) {
  if (req.body.pid >= 0 && req.body.pid < data.posts.length) {
    if (req.body.cid >= 0 && req.body.cid < data.posts[req.body.pid].comments.length) {
      data.posts[req.body.pid].comments.splice(req.body.cid , 1);
      for (var key in data.posts[req.body.pid].comments) {
        data.posts[req.body.pid].comments[key].id = key;
      }
      res.send(data.posts[req.body.pid].comments);
    } else res.status(500).send('Comment Not Found');
  } else res.status(500).send('Post Not Found');
}
exports.deleteReply = function (req, res) {
  var pid = req.body.pid, cid = req.body.cid, rid = req.body.rid;
  if (pid >= 0 && pid < data.posts.length) {
    if (cid >= 0 && cid < data.posts[pid].comments.length) {
      if (rid >= 0 && rid < data.posts[pid].comments[cid].replys.length) {
        data.posts[pid].comments[cid].replys.splice(rid, 1);
        for (var key in data.posts[pid].comments[cid].replys) {
          data.posts[pid].comments[cid].replys[key].id = key;
        }
        res.json(data.posts[pid].comments[cid].replys);
      } else res.status(500).send('Reply Not Found');
    } else res.status(500).send('Comment Not Found');
  } else res.status(500).send('Post Not Found');
}


function getPostPage (conf, username) {
  return db.getUserRoot(username).
    then(function (root) {
      return db.getPostsByConfig(conf, username, root == 'administrator').then(function(page) {
        return Promise.resolve({
                config: conf,
                posts: page
              });
      });
    })

}
function getDetailPage(user) {
  var item = {
    detail: [
      {message: '用户名: ' + user.username},
      {message: '学　号: ' + user.number},
      {message: '邮　箱: ' + user.email},
      {message: '电　话: ' + user.phone},
      {message: 'root: ' + user.root}
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
function parseUser(body) {
  var user = {};
  user.username = body[0].value;
  user.password = body[1].value;
  user.repeat = body[2].value;
  user.number = body[3].value;
  user.email = body[4].value;
  user.phone = body[5].value;
  return user;
}

function checkUser(user) {
  var errMsg = [];
  var pw = user['password'];
  for (var key in user) {
    var _key = translateKey(key);
    if (!user[key]) errMsg.push(_key + ': ' + validator.form[key].errorMessage);
    else {
      if (!validator.isFieldValid(key, user[key], pw)) errMsg.push(_key + ': ' + validator.form[key].errorMessage);
      else if (!validator.isAttrValueUnique(data.users, user, key)) errMsg.push(getUniqueErrorMessage(key));
    }
  }
  if (errMsg.length > 0) throw new Error(errMsg.join('\n'));
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
function translateKey(key) {
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

function isRootUser(username) {
  for (var key in data.users) {
    if (data.users[key].username == username) return (data.users[key].root == 'administrator');
  }
  return false;
}
function isUserExist(username) {
  for (var key in data.users) {
    if (data.users[key].username == username) return true;
  }
  return false;
}