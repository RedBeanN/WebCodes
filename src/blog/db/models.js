var mongoose = require('mongoose');

var replySchema = new mongoose.Schema({
  author: String,
  at: String,
  hiddenByAdmin: Boolean,
  date: String,
  text: String,
  id: Number
});
var commentSchema = new mongoose.Schema({
  author: String,
  text: String,
  hiddenByAdmin: Boolean,
  date: String,
  id: Number,
  replys: [replySchema]
});
var postSchema = new mongoose.Schema({
  title: String,
  author: String,
  text: [String],
  hiddenByAdmin: Boolean,
  date: String,
  // id: {type: Number, sparse: true, unique: false},
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


// var posts = [
//   {
//     title: "Lorem ipsum",
//     author: "AUTHOR1",
//     deletedByAdmin: false,
//     text: ["Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."],
//     comments: [
//       {
//         id: '0',
//         author: 'AUTHOR1',
//         deletedByAdmin: false,
//         text: 'This is text 1',
//         at: 'hongshn',
//         replys: [
//           {
//             id: 0,
//             author: 'hongshn',
//             deletedByAdmin: false,
//             text: 'Get.',
//             at: 'AUTHOR1'
//           },
//           {
//             id: 1,
//             author: 'AUTHOR1',
//             deletedByAdmin: false,
//             text: 'OK~!',
//             at: 'hongshn'
//           }
//         ],
//         date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString() 
//       },
//       {
//         d: '1',
//         author: 'AUTHOR2',
//         text: 'This is text 2',
//         deletedByAdmin: false,
//         replys: [],
//         date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
//       }
//     ],
//     date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
//   },
//   {
//     title: "Sed egestas",
//     author: "AUTHOR2",
//     deletedByAdmin: false,
//     text: ["Sed egestas", "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."],
//     comments: [],
//     date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
//   }
// ];
// var anothorPost = new postModel(posts[0]);

// for (var key in posts) {
//   postModel.find({title: posts[key].title}, function(err, data) {
//     if (!data.length) {
//       (new postModel(posts[key])).save();
//     } else {
//       console.log('post ' + data[0].title + ' is already exists');
//     }
//   })
// }

// var oneReply = new replyModel({
//   author: 'hongshn',
//   at: 'you',
//   text: 'model reply text',
//   hiddenByAdmin: false,
//   id: 0
// });

// var oneComment = new commentModel({
//   author: 'hongshn',
//   text: 'model comment text',
//   hiddenByAdmin: false,
//   id: 0,
//   replys: [oneReply]
// });

// var onePost = new postModel({
//   title: 'one post',
//   author: 'hongshn',
//   text: ['paragraph 1', 'paragraph 2'],
//   hiddenByAdmin: false,
//   id: 0,
//   comments: [oneComment]
// });