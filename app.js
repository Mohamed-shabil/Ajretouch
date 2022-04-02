require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost:27017/ajDB', { useNewUrlParser: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('Public'))

const postSchema = new Schema({
    description: String,
    imgUrl: String,
    category: String
})

const Posts = mongoose.model('post', postSchema);

app.get('/',(req,res)=>{
    // res.send('get all from here')
    Posts.find({category:"editorial"},(err,foundPosts)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundPosts);
        }
    })
})
app.get('/commercial',(res,req)=>{
    Posts.find({category:"commercial"},(err,foundPosts)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundPosts);
        }
    })
})
app.get('/fineArt',(req,res)=>{
    Posts.find({category:"fine art"},(err,foundPosts)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundPosts);
        }
    })
})
app.get('/beforeAndafter',(req,res)=>{
    Posts.find({category:"after & before"},(err,foundPosts)=>{
        if(err){
            console.log(err);
        }else{
            res.send(foundPosts);
        }
    })
})

app.get('/testimonial',(req,res)=>{
    res.send('beforeAndafter')
})
app.get('/education',(req,res)=>{
    res.send('beforeAndafter')
})
app.get('/admin',(req,res)=>{
    res.send('Admin panel')
})


app.post('/admin',(req,res)=>{
    console.log(req.body.title);
    console.log(req.body.category);
    
    const newpost = new Posts({
        title:req.body.description,
        imgUrl:req.body.imgUrl,
        category:req.body.category
    })
    newpost.save();
    res.send('Added to database')
})

app.delete('/admin',(req,res)=>{
    console.log(req.body.title);
    Posts.deleteOne(({title:req.body.description}),(err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('Deleted Successfully');
            console.log("delete successfully");
        }
    })
})

app.listen(process.env.PORT||3000,() => {
    console.log('listening on port');
})