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
  if (id >= 0 && id < data.posts.length) {
    var post = { post: data.posts[id] };
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
  res.json(getPostPage(req.body, req.cookies.username));
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
  if (!req.cookies.username) res.json(false);
  else if (req.cookies.username != data.posts[id].author && !isRootUser(req.cookies.username)) res.json(false);
  else if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};

exports.getIndex = function (req, res) {
  if (req.cookies.username && isUserExist(req.cookies.username)) {
    res.json(getDetailPage(req.cookies.username));
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
    res.cookie('username', user.username, {maxAge: cookieMaxAge});
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
        author: data.posts[i].author,
        date: data.posts[i].date,
        root: (data.posts[i].author == username || isRootUser(username)),
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
    username: data.users[username].username,
    root: isRootUser(username),
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

function isRootUser(username) {
  for (var key in data.users) {
    if (data.users[key].username == username) return (data.users[key].root == 'administrator');
  }
}
function isUserExist(username) {
  for (var key in data.users) {
    if (data.users[key].username == username) return true;
  }
  return false;
}