const express = require('express')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const Component = require('./models/component')
const port = 8087

var mongoDB = 'mongodb+srv://Damaris:12345@cluster0.gdp4f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/component', async (req, res) => {
    let newComponent = req.body
    var addComponent=new Component({ name:newComponent.name})
    await Component.create(addComponent)
    res.send(newComponent)
})

app.get('/component', async (req, res) =>{
    // const record= await Project.find({'type':req.query.type}).exec()
    const record= await Component.find({})
    console.log(record)
    res.json(record)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
