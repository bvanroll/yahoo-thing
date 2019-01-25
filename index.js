var exp = require('express');
var exphbs = require('express-handlebars');
var app = exp();
const port = 2020;
const bodyparser = require("body-parser")


const {promisify} = require('util')
var MongoClient = require('mongodb').MongoClient;
var hbs = exphbs.create({
	defaultLayout: 'main'
});



app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.engine('handlebars', hbs.engine);
app.use('static', exp.static(__dirname+'static'));

app.set('view engine', 'handlebars');
app.listen(port, function(err) {
    if (err) console.log(err)
    console.log("server is running at port 2020")
})

app.get('/',(req,res) => {
  res.render("index")
})


app.get('/about', (req, res) => {
  res.render("about")
})

app.post('/search', (req, res) => {
  console.log(req.body.title)
  MongoClient.connect("mongodb://localhost:27017/yahoo",(err, client) => {
    if (err) throw err
      var query = {title: new RegExp(req.body.title, 'gmi') }
      temp = client.db().collection("questions").find(query, {projection: {_id: 0}}).toArray(function(err, data) {
        res.render('index', {data: data})
        client.close()
    })
  });

})
