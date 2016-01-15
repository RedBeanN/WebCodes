/*
 * Serve JSON to our AngularJS client
 */
var data = {
  "posts": [
    {
      "title": "Lorem ipsum",
      "text": ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."]
    },
    {
      "title": "Sed egestas",
      "text": ["Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."]
    }
  ]
};

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
    waiting: false
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
    waiting: false
  }
}

// GET

exports.posts = function (req, res) {
  var posts = [];
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
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
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
    waiting: false
  };
  setTimeout(function() {
    res.json(items);
  }, 500)
  //res.json(items);
};

function getPostPage (conf) {
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
      text: data.posts[i].text[0].substr(0, 50) + '...'
    });
  }
  return {
    config: conf,
    posts: Page
  };
}