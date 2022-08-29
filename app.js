require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs')
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
const { Schema } = mongoose;
const session = require('express-session'); 
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static('Public'))

app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/ajDB', { useNewUrlParser: true });


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


const adminSchema= new Schema({
    username: String,
    password: String
})

adminSchema.plugin(passportLocalMongoose);

const Admin = new mongoose.model('admin', adminSchema);

passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());





app.get('/', (req, res) => {
    // res.send('get all from here')
    Posts.find({category:"editorial"},(err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('home', {
                posts: foundPosts
            })
        }
    })
})
app.get('/commercial', (req, res) => {
    Posts.find({ category: "commercial" }, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('commercial', {
                posts: foundPosts
            })
        }
    })
})
app.get('/fineArt', (req, res) => {
    Posts.find({ category: "fineart" }, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('fineArt',{posts: foundPosts});
        }
    })
})
app.get('/beforeAndafter', (req, res) => {
    Posts.find({ category: "after & before" }, (err, foundPosts) => {
        if (err) {
            console.log(err);
        } else {
            res.render('beforeAndafter',{
                posts: foundPosts
            });
        }
    })
})

app.get('/testimonial', (req, res) => {
    Reviews.find((err,foundReviews)=>{
        if(err){
            res.send(err);
        }else{
            res.render('testimonial',{
                Reviews:foundReviews
            })
        }
    })
})
app.get('/contact', (req, res) => {
    res.render('contact')
})
app.get('/admin', (req, res) => {
    if(req.isAuthenticated()){
        Posts.find((err, foundposts) => {
            if (err) {
                res.send(err)
            } else {
                res.render('admin', { post: foundposts });
            }
        })
    }
    else{
        res.redirect('/login')
    }
})

app.get('/admin/testimonialsetting',(req, res)=> {
    if(req.isAuthenticated()) {
        Reviews.find((err,foundReviews)=> {
            if(err) {
                res.send(err)
            }else{
                console.log(foundReviews)
                res.render('testimonialsetting', {Reviews:foundReviews})
            }
        })
    }
    else{
        res.redirect('/login')
    }
})
app.get('/register',(req, res)=>{
    if(req.isAuthenticated()) {
        res.render('register');
    }
    else{
        res.redirect('/login')
    }
})
app.get('/login',(req, res)=>{
    res.render('login')
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
        personName: req.body.Name,
        personImgUrls: req.body.person,
        review: req.body.testimonial
    })
    newreview.save();

    res.redirect('/testimonial');
})

app.post('/register', (req, res) => {
    Admin.register({username: req.body.username}, req.body.password,(err,user)=>{
        if(err){
            console.log(err)
            res.send(err);
        }else{
            passport.authenticate('local')(req,res, ()=>{
                res.redirect('/admin')
            })
        }
    })
})

app.post('/login',(req, res)=>{
    const newadmin = new Admin({
        username: req.body.username,
        password: req.body.password
    })
 
    req.login(newadmin,(err)=>{
        if(err){
            console.log(err)
        }else{
            passport.authenticate('local')(req,res,()=>{
                 res.redirect('/admin')
            })
        }
    })
 })
 


app.delete('/admin', (req, res) => {
    const {id} = req.body
    console.log(req.body)
    if(!id){ 
        console.log("id not found");
        return res.status(404).json({error:"Id not found"})
    }
    Posts.deleteOne({ _id:id }, (err) => {
        if (err) {
            res.send(err);
        }
        else {
            res.redirect('/');
            console.log("delete successfully");
        }
    })
})
app.delete('/admin/tesmonialsetting', (req, res) => {
    const {id} = req.body
    if(!id){ 
        console.log("id not found");
        return res.status(404).json({error:"Id not found"})
    }
    Reviews.deleteOne({_id:id}, (err) => {
        if (!err) {
            res.redirect('/');
            console.log("delete successfully");
        }
        else {
            res.send(err);
        }
    })
})

app.listen(3000, () => {
    console.log('listening on port');
})