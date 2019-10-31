let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
let app = express()

let db
let port = process.env.PORT
if(port==null || port==''){
  port = 3000
}
app.use(express.static('public'))
let connectionString= 'mongodb+srv://arneckas:arnasgxzxx@cluster0-pfwu2.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    db = client.db()
    app.listen(port)
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', function(req,res){
    let count = db.collection('items').count().then((val) => count = val);

    db.collection('items').find().toArray(function(err,items){
      count = parseInt(count/195*100)
      res.send(`
      <!doctype html>
        <html lang="en">
          <head>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
            <style>
                    html, body, #viewDiv {
                      padding: 0;
                      margin: 0;
                      height: 100%;
                      width: 100%;
                    }
            </style>
              <link rel="stylesheet" href="https://js.arcgis.com/4.13/esri/css/main.css">
            <link rel="stylesheet" href="/app.css">

            <title>World Traveler's Notes</title>
          </head>
          <body style="background-color:#b0bec5">
              <div class="h-100">
                <div class="row h-100">
                    <div class="col-sm-12 col-lg-6">
                            <div class="container">
                                    <h1 class="display-4 text-center py-1">Visited Countries</h1>                 
                                    <div class="jumbotron p-3 shadow-sm">
                                      <form id='create-form' action="/create-item" method="POST">
                                        <div class="d-flex align-items-center">
                                          <input id='create-field'  name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;" placeholder="Enter your new destination">
                                          <button class="btn button5">Add New Country</button>
                                        </div>
                                      </form>
                                    </div>
                                    
                                    <ul id='item-list' class="list-group pb-5">
                                    </ul>
                                    
                                  </div>
                                  <h2 class="display-4 text-center">World Traveled: `+count+`%</h2>
                    </div>   
                    <div class="col-sm-12 col-lg-6" id="mapsas">
                        
                    </div>
                </div>
              </div>

            <script> let items = ${JSON.stringify(items)}; </script>
            <script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>
            <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
            <script src="https://js.arcgis.com/4.13/"></script>
            <script src = '/browser.js'></script>

            </body>
        </html>
      `)
    })
    
})
app.post('/create-item', function(req,res){
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection('items').insertOne({text: safeText}, function(err,info){
        res.json(info.ops[0])
    })
})


app.post('/update-item', function(req,res){
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text:safeText}}, function(){
      res.send('sucess')
    })
})

app.post('/delete-item', function(req,res){
  db.collection('items').deleteOne({_id: new mongodb.ObjectID(req.body.id)},function(){
    res.send("Sucess")
  })
})



