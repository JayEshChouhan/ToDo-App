
// const connect = require('./test');
const express = require("express");
const app = express();
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const mongoose = require('mongoose');
const connect = () => {
    
    var url = 'mongodb+srv://Jayesh:J%40yesh123@cluster0.ajrxt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(url, {
    useNewUrlParser: true, 

    useUnifiedTopology: true 
})
mongoose.connection.once("open", async () => {
   console.log("Connected to database");
});
  
mongoose.connection.on("error", (err) => {
    console.log("Error connecting to database  ", err);
});

return mongoose;
}


app.use("/public" , express.static("public"));
app.use(express.urlencoded({extended: false}));

app.set("view engine", "ejs");
var db = connect();
const taskSchema = new mongoose.Schema({ name: 'string', time: 'string'});
const Task = db.model('todos', taskSchema);

app.get('/',async (req, res) => {
    res.render("todo.ejs");
});

app.get('/getdata',async (req, res) => {
    const d=await Task.find({});
    res.json(d);
});
app.post('/',(req, res) => {
    Task.create(req.body , err =>{
        if (!err) {
            res.redirect('/');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
});
app.get('/delete/(:id)', (req, res) => {
    Task.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
})


app.delete('/delete/', function (req, res) {
   console.log(req.body);
//    connection.query('DELETE FROM `employee` WHERE `id`=?', [req.body.id], function (error, results, fields) {
// 	  if (error) throw error;
// 	  res.end('Record has been deleted!');
// 	});
});


app.post('/edit/(:id)', (req, res) => {
    console.log(req.body);
    Task.findByIdAndUpdate(req.params.id,{ $set: req.body }, (err, doc) => {
        if (!err) {
            res.redirect('/');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
})

app.listen(3000, () => console.log("Server Up and running new"));