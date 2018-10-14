const express  = require('express');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();
//map global promise - get rid of warning

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://shashi:shashi123@ds229373.mlab.com:29373/flipkart' , {
    useMongoClient:true
}).then(()=> console.log('mongodb connected'))
 .catch(err => console.log(err));


 //load Idea Model
 require('./models/Idea');
 const Idea = mongoose.model('ideas');

// middlewares
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 // parse application/json
app.use(bodyParser.json());



app.get('/' , (req , res)=>{
 res.render('index');

});

//Idea index Page
app.get('/ideas' , (req , res)=>{
    Idea.find({})
     .sort({date:'desc'})   
     .then(ideas => {
        res.render('ideas/index' , {
            ideas:ideas
        });
    })
    
})

// add idea Form
app.get('/ideas/add' , (req , res)=>{
    res.render('ideas/add');
   
});

//Process Form
app.post('/ideas' , (req , res)=>{
    let errors = [];

    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'})
    }

    if(errors.length > 0){
        res.render('ideas/add' , {
           errors : errors,
           title : req.body.title,
           details : req.body.details 
        });
    }else {
        const newUser = {
            title : req.body.title,
            details:req.body.details
        }

        new Idea(newUser).save().then(idea =>{
            res.redirect('/ideas');
        })

    }

});

app.listen(3000 , function(err){
    if(err){
        console.log(err);
    }else {
        console.log('app is running on port number 3000');
    }
})