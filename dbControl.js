const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);


// date : date object
const makeDateForm = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${year}.${month}.${day}`;
};
// postID : number
const getPost = (id) => {
  return db.get('posts').find({id}).value();
};

const getAllPosts = () => {
  return db.get('posts').value();
};

// title : string
// content : string
// author : string
const addPost = (title, content, author) => {
  let id = db.get('posts[0].id').value() || 0;
  const newPost = {
    title,
    content,
    author,
    id: ++id,
    date: makeDateForm(new Date()),
    count: 0,
    comments: []
  };
  db.get('posts').unshift(newPost).write();
};

// id : number
// comment : string
// author : string
const addComment = (id, comment, author) => {
  const comments = getPost(id).comments;
  let commentID = comments[comments.length-1].commentID || 0;
  const newComment = {
    comment,
    author,
    data: makeDateForm(new Date()),
    commentID: ++commentID
  };
  db.get('posts').find({id})
    .get('comments').push(newComment).write();
};

// postID : number
const removePost = (id) => {
  db.get('posts').remove({id}).write();
};

const removeComment = (id, commentID) => {
  db.get('posts').find({id})
    .get('comments').remove({commentID}).write();
};

module.exports = {
  getPost,
  getAllPosts,
  addPost,
  addComment,
  removePost,
  removeComment,
};
