const express = require('express')
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors')
const fetch = require('node-fetch');
const baseUrl = 'http://localhost';
const authServiceUrl = baseUrl + ':8082';
const projServiceUrl = baseUrl + ':8083';
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const Component = require('./models/component');
const component = require('./models/component');
const port = 8087

var mongoDB = 'mongodb+srv://cata:cata@cluster0.wcbqw.mongodb.net/first?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/component', async (req, res) => {
    let newComponent = req.body
    console.log(newComponent)
    var addComponent=new Component({ name:newComponent.name, description:newComponent.description, user_id:newComponent.user_id, project_id:newComponent.project_id})
    await Component.create(addComponent)
    res.send(newComponent)
})

app.get('/component', async (req, res) =>{
    let result = [];
    let record = await Component.find({})
    const userIds = record.map(c => c.user_id);
    const projectIds = record.map(c => c.project_id);

    let users = [];
    let projects = [];
    await fetch(authServiceUrl + '/allusers', 
    { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userIds)
    })
    .then(res => res.json())
    .then(data => users = data);

    //projects
    await fetch(projServiceUrl + '/allprojects', 
    { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectIds)
    })
    .then(res => res.json())
    .then(data => projects = data);

    for (let index = 0; index < record.length; index++) {
        if (!users[index]) {
            users[index] = { username: "no user" };
        }
        if (!projects[index]) {
            projects[index] = { projectName: "no project" };
        }
        const componentDTO = {
            _id: record[index]._id,
            name: record[index].name,
            description: record[index].description,
            user_id: users[index]._id,
            username: users[index].username,
            project_id: projects[index]._id,
            projectName: projects[index].name,
            issuesNo: 0
            // _id: record[index]._id,
        }
        result.push(componentDTO);   
    } 
    res.json(result)
})

//edit component

app.put('/component', async (req, res) => {
    const newObject = req.body
    console.log(newObject)
    var id_=req.params.id
    const filter={_id:req.body._id}
    let update_= await Component.findOneAndUpdate(filter, newObject, {
        new: true,
        upsert: true 
      });
    res.send(update_)
 })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
