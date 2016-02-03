var Promise = require('bluebird');
var users = [{
  username: 'hongshn',
  name: 'hsn',
  userRoot: 'student',
  password: 'hongshn',
  sid: 14359047,
  notifications: [
    'New homework published',
    'New Score published'
  ],
  group: 23,
  _id: 0
},{
  username: 'aTA',
  name: 'xxx',
  userRoot: 'TA',
  password: 'tapassword',
  sid: 10000000,
  group: 0,
  _id: 1
}];
var homeworks = [{
  title: 'Homework1',
  status: 'end',
  deadline: '2016/1/28 23:55',
  url: 'homeworks/detail/0',
  _id: 0
}, {
  title: 'Homework2',
  status: 'present',
  deadline: '2016/2/22 23:55',
  url: 'homeworks/detail/1',
  _id: 1
}];
var submissions = [{
  uid: 0,
  hwid: 0,
  count: 0,
  filePath: '/files/0/0/sub.rar',
  imagePath: '/files/0/0/img.jpg',
  githubPath: 'github.com',
  _id: 0
}];
var reviews = [{
  submitId: 0,
  author: 'Student',
  text: '666',
  score: 90,
  _id: 0
}, {
  submitId: 0,
  author: 'TA',
  text: 'nice',
  _id: 1
}];

exports.getUser = function (userid) {
  for (var key in users) {
    if (users[key]._id == userid) return Promise.resolve(users[key]);
  }
  return Promise.reject();
};
exports.getUserByUsername = function (username) {
  for (var key in users) {
    if (users[key].username == username) return Promise.resolve(users[key]);
  }
  return Promise.reject('Cannot Find the User');
};
exports.getHomeworks = function () {
  return Promise.resolve(homeworks);
};
exports.getHomework = function (id) {
  for (var key in homeworks) {
    if (homeworks[key].id == id) return Promise.resolve(homeworks[key]);
  }
  return Promise.reject({message: 'No such homework.'});
};
exports.userReadNotifications = function (uid) {
  for (var key in users) {
    if (users[key]._id == uid) {
      users[key].notifications = [];
      return Promise.resolve('Marked succeeded.');
    }
  }
  return Promise.reject('Cannot Find the User');
};