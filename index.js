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

var arraySize = 25


function splice(arr){
    fin = [];
    while(arr.length() > arraySize){
        fin.push(arr.splice(0,24))
    }
    fin.push(arr);
    return fin; 
}




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
   
  MongoClient.connect("mongodb://localhost:27017/yahoo",(err, client) => {
    if (err) throw err
      var query = {title: new RegExp(req.body.title, 'gmi') }
      temp = client.db().collection("questions").find(query).toArray(function(err, data) {
        arr = splice(data) 
        page = 0 + parseInt(req.body.page, 10)
        res.render('index', {data: arr[page],page:page,maxpages:arr.length()})
        client.close()
    })
  });

})
