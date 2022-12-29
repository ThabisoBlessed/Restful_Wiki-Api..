//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


  const articlSchema = {
    title:String,
    content:String
  };

const Article = mongoose.model("Article",articlSchema);


//Requeststargeting  all Articles.

app.route("/articles")
.get(function(req,res)
{

    Article.find(function(err,foundArticles)
    {
      if(!err)
      {
        res.send(foundArticles);
      }
      else{
        res.send(err);
      }
      
    });
})
.post(function(req,res)
{
    console.log(req.body.title);
    console.log(req.body.content);
    const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save(function(err)
    {
      if(!err)
      {
        res.send("Success!!");
      }
      else{
        res.send(err);
      }
    })
})
.delete(function(req,res)
{
  Article.deleteMany(function(err)
  {
    if(err)
    {
      res.send(err);
    }
    else{
      res.send("Success deletion !!");
    }
  });

});

//Requeststargeting  a  specific Article.

app.route("/articles/:articleTitle")
.get(function(req,res){

  
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    
    if(foundArticle)
    {
      res.send(foundArticle);
    }
    else{
      res.send("No match");
    }
  });

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});