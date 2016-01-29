var Promise = require('bluebird');
var users = [{
  username: 'hongshn',
  name: 'hsn',
  userRoot: 'student',
  password: 'hongshn',
  sid: 14359047,
  group: 23,
  uid: 0
},{
  username: 'aTA',
  name: 'xxx',
  userRoot: 'TA',
  password: 'tapassword',
  sid: 10000000,
  group: 0,
  uid: 1
}];
var homeworks = [{
  hwid: 0,
  title: 'Homework1',
  status: 'end',
  deadline: '2016/1/28 23:55',
  options: [
    {
      url: 'homeworks/detail/0',
      title: ' Detail '
    },{
      url: 'homeworks/download/0',
      title: ' My Code '
    }, {
      url: 'homeworks/review/0',
      title: ' Review '
    }
  ]
}, {
  hwid: 1,
  title: 'Homework2',
  status: 'present',
  deadline: '2016/2/22 23:55',
  options: [
    {
      url: 'homeworks/detail/1',
      title: ' Detail '
    },{
      url: 'homeworks/submit/1',
      title: ' Submit '
    }, {
      url: 'homeworks/review/1',
      title: ' Review '
    }
  ]
}];
var submissions = [{
  uid: 0,
  hwid: 0,
  reviewsid: 0,
  submissionId: 0,
  filePath: '/files/0/0/sub.rar',
  imagePath: '/files/0/0/img.jpg',
  githubPath: 'github.com'
}];
var reviews = [{
  uid: 0,
  hwid: 0,
  submissionId: 0,
  reviewsid: 0,
  isReviewEnded: false,
  targetSubmissionsId: [0, 1, 2, 3, 4],
  comments: [{
    author: 'TA',
    text: 'good',
    score: 90
  }, {
    author: 'student',
    text: 'good!',
    score: 89
  }]
}]

exports.getUser = function (userid) {
  for (var key in users) {
    if (users[key].userid == userid) return Promise.resolve(users[key]);
  }
  return Promise.reject();
}
exports.getHomeworks = function () {
  return Promise.resolve(homeworks);
}
exports.getHomework = function (id) {
  for (var key in homeworks) {
    if (homeworks[key].id == id) return Promise.resolve(homeworks[key]);
  }
  return Promise.reject({message: 'No such homework.'});
}