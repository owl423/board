const express = require('express');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const morgan = require('morgan');
const db = require('./dbControl.js');
const app = express();
const port = process.env.PORT || 3333;


const bodyParserMiddleWare = bodyParser.urlencoded({extended: false});
const authMiddleWare = basicAuth({
  users: { 'admin': 'admin' },
  challenge: true,
  realm: 'Imb4T3st4pp'
});
app.use(morgan('tiny'));
app.set('view engine', 'pug');
app.use('/static', express.static('public'));

app.get('/', (req, res)=>{
  const data = db.getAllPosts();
  res.render('index.pug', {data})
});

app.get('/write', (req, res)=>{
  res.render('newPost.pug')
});
app.post('/regist', bodyParserMiddleWare, (req, res)=>{
  db.addPost(req.body.title, req.body.content, req.body.author);
  res.redirect('/');
});
app.get('/admin', authMiddleWare, (req, res)=> {
  const data = db.getAllPosts();
  res.render('adminIndex.pug', {data});
});
app.get('/:id', (req, res)=>{
  const post = db.getPost(Number(req.params.id));
  if(!post){
    res.status(404);
    res.send('404 Not Found');
    return;
  }
  res.render('content.pug', {data: post});
});
app.post('/comment/:id', bodyParserMiddleWare, (req, res) => {
  db.addComment(Number(req.params.id), req.body.comment, req.body.author);
  res.redirect(`/${req.params.id}`);
});
app.get('/admin/:id', (req, res)=>{
  const post = db.getPost(Number(req.params.id));
  res.render('admincontent.pug', {data: post});
});
app.post('/admin/:id/:commentID', (req, res)=>{
  // const post = data.find(item=> item.id === Number(req.params.id));
  // const commentIndex = post.comments.findIndex(comment => comment.commentID === Number(req.params.commnetID));
  // post.comments.splice(commentIndex, 1);
  db.removeComment(Number(req.params.id), Number(req.params.commentID));
  res.redirect(`/admin/${req.params.id}`);
});
app.post('/delete/:id', (req, res)=>{
  db.removePost(Number(req.params.id));
  res.redirect('/admin');
});
app.listen(port, ()=>{
  console.log('server on');
});