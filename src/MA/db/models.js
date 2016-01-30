var mongoose = require('mongoose');

exports.userSchema = new mongoose.Schema({
  username: String,
  name: String,
  userRoot: String,
  password: String,
  sid: Number,
  group: Number
});
exports.homeworkSchema = new mongoose.Schema({
  title: String,
  status: String,
  deadline: Date,
  detail: String,
  url: String
});
exports.homeworkDetailSchema = new mongoose.Schema({
  title: String,
  description: [String],
  requirement: [String],
  gradeStandard: [String]
});
exports.submissionSchema = new mongoose.Schema({
  userid: String,
  homeworkid: String,
  reviewsid: [String],
  filePath: String,
  imagePath: String,
  githubPath: String,
  discription: String
});
// exports.reviewSchema = new mongoose.Schema({
//   userid: String,
//   homeworkid: String,
//   submissionId: String,
//   targetSubmissionsId: [String],
//   commentsId: [String]
// });
exports.reviewsSchema = new mongoose.Schema({
  author: String,
  text: String,
  score: Number
});