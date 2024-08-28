const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

const env = new nunjucks.Environment();

const dt = new Date();
const full_date = (dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear()).toString();

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let day = days[dt.getDay() - 1];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/logs.log'), { flags: 'a' })
app.use(morgan("[:date[web]]    :    :method  |  ':url'  |   HTTP/:http-version   |  Code :status  |  :response-time ms", { stream: accessLogStream }))
app.use(express.json())
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    let data = {
        'meta': {
            'time': {
                'hours': dt.getHours(),
                'minutes': dt.getMinutes(),
            },
            'current_period': 'temp',
        }
    }
    res.render('home.html', data);
});

app.get('/login', (req, res) => {
    res.render('login.html');
});

app.post('/login', (req, res) => {
    let username = ((req.body.username).replace(/\s+/g, '')).toLowerCase();
    res.redirect('/teachers/' + username);
});

app.get('/teachers/:name', (req, res) => {
    let loc_def = __dirname + '/database/default/' + req.params.name + '/tt.json';
    const tt_def = (JSON.parse(fs.readFileSync(loc_def)));
    // console.log(tt_def);
    let data = {
        'tt': tt_def,
        'meta': {
            'time': {
                'hours': dt.getHours(),
                'minutes': dt.getMinutes(),
            },
            'current_period': 'temp',
        }
    }

    res.render('teachers.html', data);
});

const port = 3000
app.listen(port, () => console.log(`This app is listening on port ${port}`));