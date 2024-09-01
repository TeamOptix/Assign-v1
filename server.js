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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs/logs.log'), { flags: 'a' })
app.use(morgan("[:date[web]]    :    :method  |  ':url'  |   HTTP/:http-version   |  Code :status  |  :response-time ms", { stream: accessLogStream }))
app.use(express.json())
nunjucks.configure('templates', {
    autoescape: true,
    express: app
});

function get_current_period(hour_minute) {
    if (hour_minute == null) {
        hour_minute = dt.getHours().toString() + dt.getMinutes().toString();
    }
    if (dt.getDay() == 7) { return 'None'; }
    // TODO: Add exceptions for days where a test is scheduled...handle user input for if fridays(or others) are tests
    else {
        if (hour_minute >= 1445 || hour_minute <= 745) { return 'None'; }
        else {
            if (hour_minute >= 750 && hour_minute < 800) {
                return 'Prayer/Soul Time';
            }
            else if (hour_minute >= 800 && hour_minute < 835) {
                return 'First';
            }
            else if (hour_minute >= 835 && hour_minute < 850) {
                return 'Break';
            }
            else if (hour_minute >= 800 && hour_minute < 930) {
                return 'Second';
            }
            else if (hour_minute >= 930 && hour_minute < 1005) {
                return 'Third';
            }
            else if (hour_minute >= 1005 && hour_minute < 1040) {
                return 'Fourth';
            }
            else if (hour_minute >= 1040 && hour_minute < 1115) {
                return 'Fifth';
            }
            else if (hour_minute >= 1115 && hour_minute < 1150) {
                return 'Sixth';
            }
            else if (hour_minute >= 1150 && hour_minute < 1220) {
                return 'Lunch';
            }
            else if (hour_minute >= 1220 && hour_minute < 1300) {
                return 'Seventh';
            }
            else if (hour_minute >= 1300 && hour_minute < 1335) {
                return 'Eight';
            }
            else if (hour_minute >= 1335 && hour_minute < 1410) {
                return 'Ninth';
            }
            else if (hour_minute >= 1410 && hour_minute < 1445) {
                return 'Dispersal';
            }
        }
    }
}

function get_time() {
    let day = days[dt.getDay() - 1];
    let day_of_week = dt.getDay();
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    if (hours < 10) { hours = '0' + hours.toString(); }
    if (minutes < 10) { minutes = '0' + minutes.toString(); }

    return ({ 'day': day, 'day_w': day_of_week, 'hours': hours, 'minutes': minutes });
}

app.get('/', (req, res) => {
    let data = {
        'meta': {
            'time': {
                'day': get_time().day,
                'hours': get_time().hours,
                'minutes': get_time().minutes,
            },
            'current_period': get_current_period(null),
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
    let data = {
        // 'tt': tt_def,
        'tt': {
            'day1': tt_def.monday,
            'day2': tt_def.tuesday,
            'day3': tt_def.wednesday,
            'day4': tt_def.thursday,
            'day5': tt_def.friday,
        },
        'meta': {
            'time': {
                'day': get_time().day,
                'hours': get_time().hours,
                'minutes': get_time().minutes,
            },
            'current_period': get_current_period(null),
        }
    }

    res.render('teachers.html', data);
});

const port = 3000
app.listen(port, () => console.log(`This app is listening on port ${port}`));