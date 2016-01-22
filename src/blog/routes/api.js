/*
 * Serve JSON to our AngularJS client
 */

var validator = require('../public/js/validator.js'),
    bcrypt = require('bcryptjs'),
    salt = bcrypt.genSaltSync(10),
    cookieMaxAge = 24 * 60 * 60 * 1000;
var data = {
  posts: [
    {
      title: "Lorem ipsum",
      text: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."],
      comments: [
        {
          author: 'AUTHOR1',
          text: 'This is text 1',
          id: '1'
        },
        {
          author: 'AUTHOR2',
          at: 'AUTHOR1',
          text: 'This is text 2',
          id: '2'
        }
      ]
    },
    {
      title: "Sed egestas",
      text: ["Sed egestas", "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."],
      comments: []
    }
  ]
};
var users = {};

var items = {
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

// GET

/*exports.posts = function (req, res) {
  var posts = [];
  if (!data) res.json({});
  else {
  data.posts.forEach(function (post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text[0].substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
  }
};*/

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    var resp = { post: data.posts[id] };
    resp.post.id = id;
    res.json(resp);
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

exports.postPage = function (req, res) {
  var page = getPostPage(req.body);
  res.json(page);
}

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.getIndex = function (req, res) {
  var item = items.login;
  if (req.cookies.username) item.lines[0].value = req.cookies.username;
  setTimeout(function() {
    res.json(item);
  }, 500);
  //res.json(item);
};

exports.getRegist = function (req, res) {
  setTimeout(function() {
    res.json(items.regist);
  }, 500);
  //res.json(items.regist);
};

exports.login = function(req, res) {
  var items = {
    data: [
      {message: req.body[0].title + ': ' + req.body[0].value},
      {message: req.body[1].title + ': ' + req.body[1].value}
    ],
    operations: [
      {value: '退出', type: 'submit', title: 'logout', id: 'submit'}
    ],
    waiting: false,
    isLogin: true
  };
  setTimeout(function() {
    res.json(items);
  }, 500)
  //res.json(items);
};

exports.regist = function(req, res) {
  /*console.log(req.body);
  var items = {
    data: [{message: req.body[0].title + ': ' + req.body[0].value},
      {message: req.body[1].title + ': ' + req.body[1].value}],
    operations: [{value: '退出', type: 'submit', title: 'logout', id: 'submit'}],
    waiting: false,
    isLogin: true};*/
  try {
    var user = parseUser(req.body);
    checkUser(user);
    users[user.username] = user;
    //users[user.username].password = bcrypt.hashSync(req.body.password, salt);
    //registUserToDB(users[user.username]);
    res.cookie('username', req.body.username, {maxAge: cookieMaxAge});
    res.json({
      data: [{message: '用户名：' + users[user.username].username}],
      operations: [{value: '退出', type: 'submit', title: 'logout', id: 'submit'}],
      waiting: false,
      isLogin: true
    });
  } catch(err) {
    res.json({
      data: [{message: err.message}],
      waiting: false,
      isLogin: false
    })
  }
  /*setTimeout(function() {
    res.json(items);
  }, 500)*/
}

function getPostPage (conf) {
  if (!data) return{};
  else {
    conf.totalItems = data.posts.length;
    conf.totalPages = Math.ceil(conf.totalItems / conf.itemsPerPage);
    if (conf.currentPage > conf.totalPages) return 'ERROR';
    var Page = [];
    for (var i = (conf.currentPage - 1) * conf.itemsPerPage;
             i <= conf.currentPage * conf.itemsPerPage - 1; i++) {
      if (i >= conf.totalItems) break;
      Page.push({
        id: i,
        title: data.posts[i].title,
        text: data.posts[i].text[0].length > 50 ? data.posts[i].text[0].substr(0, 50) + '...' : data.posts[i].text[0]
      });
    }
    return {
      config: conf,
      posts: Page
    };
  }
}

// functions
function parseUser(body) {
  return {username: body.username, number: body.number, phone: body.phone, email: body.email};
}

function checkUser(user) {
  var errMsg = [];
  var pw = user['password'];
  for (var key in user) {
    var _key = validator.getID(key);
    if (!user[_key] || !validator.isFieldValid(_key, user[_key]), pw) errMsg.push(validator.form[_key].errorMessage);
    if (!!user[_key] && !validator.isAttrValueUnique(users, user, _key)) errMsg.push(getUniqueErrorMessage(_key));
  }
  if (errMsg.length > 0) throw new Error(errMsg.join('\n'));
}

function authUser(user) {
  if (!bcrypt.compareSync(user.password, users[user.username].password)) throw new Error('Password error');
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