
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

app.get('/',async (req, res) => {
    const Task = db.model('todos', taskSchema);
    res.render("todo.ejs");
});

app.get('/getdata',async (req, res) => {

    const Task = db.model('todos', taskSchema);
    const d=await Task.find({});
    res.json(d);
});
app.post('/',(req, res) => {
    const Task = db.model('todos', taskSchema);
    console.log(req.body);
    console.log(req.params.id);
    Task.create(req.body , err =>{
        if (!err) {
            res.redirect('/');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
});
app.get('/delete/(:id)', function(req, res, next) {
    const Task = db.model('todos', taskSchema);
    Task.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
})
app.post('/edit/(:id)', function(req, res) {
    console.log(req.body);
    const Task = db.model('todos', taskSchema);
    Task.findByIdAndUpdate(req.params.id,{ $set: req.body }, (err, doc) => {
        if (!err) {
            res.redirect('/');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
})

app.listen(3000, () => console.log("Server Up and running new"));