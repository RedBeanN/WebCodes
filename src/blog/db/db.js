var mongoose = require('mongoose');
var models = require('./models');
var Promise = require('bluebird');
var autoinc = require('mongoose-id-autoinc');
var bcrypt = require('bcryptjs'),
      salt = bcrypt.genSaltSync(10);
var replySchema = models.replySchema,
      commentSchema = models.commentSchema,
      postSchema = models.postSchema,
      userSchema = models.userSchema;

// mongoose.connect('mongodb://localhost/data');
// var db = mongoose.connection;
var db = mongoose.createConnection('localhost', 'data');
autoinc.init(db);
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Mongoose has opened the database.');
});
// postSchema.plugin(autoinc.plugin, {model: 'postModel', field: 'id', start: 0, step: 1});
var replyModel = db.model('replyModel', replySchema);
var commentModel = db.model('commentModel', commentSchema);
var postModel = db.model('postModel', postSchema);
var userModel = db.model('userModel', userSchema);

// create Admin user if isn't exist
userModel.find({username: 'hongshn'}).then(function(data) {
  if (!data.length) {
    (new userModel({
      username: 'hongshn',
      password: bcrypt.hashSync('hsn41432', salt),
      number: 14359047,
      phone: 15602404445,
      email: 'admin@hongshn.xyz',
      root: 'administrator'
    })).save();
    console.log('[Mongoose] Admin does not exist. Create admin account.');
  } else {
    console.log('[Mongoose] Admin exists.');
  }
});

postModel.find().then(function (data) {
  console.log('[Mongoose] ' + (data.length? 'Find ' + data.length + ' data' : 'Cannot find data!'));
  // for (var key in data) {
  //   console.log(key, data[key].id);
  // }
})

exports.getPostById = function (id) {
  return postModel.find().
    then(function (posts) {
      if (!posts.length) return Promise.reject('Cannot Find Post');
      else if (posts[id].hiddenByAdmin) {
        var hiddenPost = posts[id];
        hiddenPost.text = ['`该内容已被管理员隐藏。`'];
        return Promise.resolve(hiddenPost);
      }
      else return Promise.resolve(posts[id]);
    })
}
exports.getPostsByConfig = function (conf, username, isRootUser) {
  return postModel.find().
    then(function (posts) {
      if (!posts.length) return Promise.reject('No Post Exist');
      else {
        conf.totalItems = posts.length;
        conf.totalPages = Math.ceil(conf.totalItems / conf.itemsPerPage);
        if (conf.currentPage > conf.totalPages) return Promise.reject('Error Page Number');
        var page = [];
        for (var i = (conf.currentPage - 1) * conf.itemsPerPage;
              i <= conf.currentPage * conf.itemsPerPage - 1; i++) {
          if (i >= conf.totalItems) break;
          // var post = posts[i];
          // console.log(posts[id]);
          var post = {};
          if (!posts[i].hiddenByAdmin) post.text = posts[i].text;
          else post.text = ['该内容已被管理员隐藏'];
          post.hiddenByAdmin = posts[i].hiddenByAdmin;
          post.title = posts[i].title;
          post.author = posts[i].author;
          post.date = posts[i].date;
          post.id = i;
          post.isAuthor = (post.author == username);
          post.root = isRootUser;
          post.text = post.text[0].length > 50 ? post.text[0].substr(0, 50) + '...' : post.text[0];
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
  // postModel.count(function (err, count) {
      // post.id = count;
  //   post.save(function (data) {console.log(data)});
  //   console.log(post);
  // })
  post.save();
}
exports.removePostFromDB = function (id, username, isRootUser) {
  return postModel.find().
    then(function (post) {
      if (post[id].author == username || isRootUser) {
        return postModel.remove({_id: post[id]._id}).
          then(function (data) {
            return postModel.find().
              then(function (data) {
                return Promise.resolve(true);
              })
          })
      } else return Promise.reject(false);
    })
}
exports.updatePostInDB = function (id, username, isRootUser, option, change) {
  if (option == 'edit') {
    return postModel.find().then(function (post) {
      if (post[id].author == username) {
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
      return postModel.find().then(function (posts) {
        console.log(posts[id].hiddenByAdmin);
        posts[id].hiddenByAdmin = true;
        posts[id].save();
        return Promise.resolve(true);
      })
    } else return Promise.reject('非管理员不能隐藏博客');
  }
}

exports.registUserToDB = function (user) {
  return userModel.find({username: user.username}).
    then(function (data) {
      if (data.length) return Promise.reject('用户已存在');
      else {
        var usr = new userModel(user);
        usr.password = bcrypt.hashSync(usr.password, salt);
        usr.save();
        return Promise.resolve(usr);
      }
    });
}
exports.checkUserInDB = function (username, password) {
  return userModel.find({username: username}).
    then(function(data) {
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
      if (!data.length) return Promise.resolve('user');
      else return Promise.resolve(data[0].root);
    })
}
exports.changeUserPassword = function (username, oldPsw, newPsw) {
  return userModel.find({username: username}).
    then(function(data) {
      if (!data) return Promise.reject('Cannot Found User: ' + username);
      else {
        if (bcrypt.compareSync(oldPsw, data[0].password)) {
          data[0].password = bcrypt.hashSync(newPsw, salt);
          return Promise.resolve(true);
        } else return Promise.reject('Password error');
      }
    })
}