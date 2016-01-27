var mongoose = require('mongoose');

var replySchema = new mongoose.Schema({
  author: String,
  at: String,
  hiddenByAdmin: Boolean,
  date: String,
  text: String
});
var commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  hiddenByAdmin: Boolean,
  date: String,
  replys: [replySchema]
});
var postSchema = new mongoose.Schema({
  title: String,
  author: String,
  text: [String],
  hiddenByAdmin: Boolean,
  date: String,
  comments: [commentSchema],
  isAuthor: Boolean,
  root: Boolean
});
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  number: Number,
  phone: Number,
  email: String,
  root: String
})

exports.replySchema = replySchema;
exports.commentSchema = commentSchema;
exports.postSchema = postSchema;
exports.userSchema = userSchema;

exports.templates = {
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
