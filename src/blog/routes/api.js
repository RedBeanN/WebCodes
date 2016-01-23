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
  ],
  users: {
      'hongshn': {
        username: 'hongshn',
        password: 'hsn41432',
        number: '14359047',
        email: 'shnhong@gmail.com',
        phone: '15602404445',
        root: 'administrator'
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
  res.json(getPostPage(req.body));
}

// PUT

exports.addComment = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    req.body.id = data.posts[id].comments.length;
    if (req.cookies.username) req.body.author = req.cookies.username;
    data.posts[id].comments.push(req.body);
    res.json(req.body);
  } else res.json(false);
}

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
  if (req.cookies.username) {
    res.json(getDetailPage(req.cookies.username));
  } else {
    var items = {
      welcome: '游客，请点击上方按钮登录或注册。',
      waiting: false,
      isLogin: false
    };
    res.json(items);
  }
}

exports.logout = function (req, res) {
  res.cookie('username', '', {maxAge: -1});
  res.end();
}

exports.getLogin = function (req, res) {
  var loginPage = templates.login;
  setTimeout(function() {
    res.json(loginPage);
  }, 500);
  //res.json(item);
};

exports.getRegist = function (req, res) {
  setTimeout(function() {
    res.json(templates.regist);
  }, 500);
  //res.json(items.regist);
};

exports.login = function(req, res) {
  if (!!req.body[0].value && !!data.users[req.body[0].value] && data.users[req.body[0].value].password == req.body[1].value) {
    setTimeout(function() {
      res.cookie('username', req.body[0].value, {maxAge: cookieMaxAge});
      res.json(getDetailPage(req.body[0].value));
    }, 500)
  } else {
    res.send(false);
  }
};

exports.regist = function(req, res) {
  try {
    var user = parseUser(req.body);
    checkUser(user);
    user.root = 'user';
    data.users[user.username] = user;
    //users[user.username].password = bcrypt.hashSync(req.body.password, salt);
    //registUserToDB(users[user.username]);
    res.cookie('username', req.body.username, {maxAge: cookieMaxAge});
    res.json(getDetailPage(req.body[0].value));
  } catch(err) {
    res.json({
      data: err.message.split('\n'),
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
function getDetailPage(username) {
  return {
    detail: [
      {message: '用户名: ' + data.users[username].username},
      {message: '学　号: ' + data.users[username].number},
      {message: '邮　箱: ' + data.users[username].email},
      {message: '电　话: ' + data.users[username].phone},
      {message: 'root: ' + data.users[username].root}
    ],
    operations: [
      {value: '退出', type: 'submit', title: 'logout', id: 'submit'}
    ],
    waiting: false,
    isLogin: true
  };
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
      if (!validator.isFieldValid(key, user[key], pw)) errMsg.push('``' + _key + ': ' + validator.form[key].errorMessage);
      else if (!validator.isAttrValueUnique(data.users, user, key)) errMsg.push(getUniqueErrorMessage(key));
    }
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