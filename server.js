const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const env = new nunjucks.Environment();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/logs.log'), { flags: 'a' })
app.use(morgan("[:date[web]]    :    :method  |  ':url'  |   HTTP/:http-version   |  Code :status  |  :response-time ms", { stream: accessLogStream }))
app.use(express.json())
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

let day;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/templates/login.html');
});

app.get('/teachers/:name', (req, res) => {
    res.send(req.params);
    console.log(req.params.name);

    let loc_def = __dirname + '/database/default/' + req.params.name + '/tt.json';
    const tt_def = (JSON.parse(fs.readFileSync(loc_def))).monday;
    console.log(tt_def);

    // res.render('')
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${username} Password: ${password}`);
});

const port = 3000
app.listen(port, () => console.log(`This app is listening on port ${port}`));