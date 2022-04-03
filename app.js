require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs')
const bodyParser = require('body-parser');
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost:27017/ajDB', { useNewUrlParser: true });

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('Public'))

const postSchema = new Schema({
    description: String,
    imgUrl: String,
    category: String
})

const reviewsSchema = new Schema({
    personName: String,
    personImgUrls: String,
    review: String
})
const Posts = mongoose.model('post', postSchema);

const Reviews = mongoose.model('review', reviewsSchema);

app.get('/', (req, res) => {
    // res.send('get all from here')
    Posts.find(/*{category:"editorial"},*/(err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('home', {
                posts: foundPosts
            })
        }
    })
})
app.get('/commercial', (res, req) => {
    Posts.find({ category: "commercial" }, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.send(foundPosts);
        }
    })
})
app.get('/fineArt', (req, res) => {
    Posts.find({ category: "fine art" }, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.send(foundPosts);
        }
    })
})
app.get('/beforeAndafter', (req, res) => {
    Posts.find({ category: "after & before" }, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.send(foundPosts);
        }
    })
})

app.get('/testimonial', (req, res) => {
    res.send('beforeAndafter')
})
app.get('/education', (req, res) => {
    res.send('beforeAndafter')
})
app.get('/admin', (req, res) => {
    Posts.find((err, foundposts) => {
        if (err) {
            res.send(err)
        } else {
            res.render('admin', { post: foundposts });
        }
    })
})
app.get('/admin/testimonialsetiing',(req, res)=> {
    Reviews.find((err,foundReviews)=> {
        if(err) {
            res.send(err)
        }else{
            res.render('testimonialsetting', {Reviews:foundReviews})
        }
    })
})

app.post('/admin', (req, res) => {


    const newpost = new Posts({
        description: req.body.description,
        imgUrl: req.body.imgUrl,
        category: req.body.category
    })
    newpost.save();
    res.redirect('/');


})
app.post('/admin/tesmonialsetting', (req, res) => {


    const newreview = new Reviews({
        personName: String,
        personImgUrls: String,
        review: String
    })
    newreview.save();
    res.redirect('/testimonial');


})

app.delete('/admin', (req, res) => {
    console.log(req.body.id);
    Posts.deleteOne({ _id: req.body.id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.send('Deleted Successfully');
            console.log("delete successfully");
        }
    })
})

app.listen(3000, () => {
    console.log('listening on port');
})