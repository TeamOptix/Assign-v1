const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

let day;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/templates/assign_home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/templates/assign_login.html');
});

app.get('/teachers/:name', (req, res) => {
    res.send(req.params);
    console.log(req.params.name);

    let loc_def = __dirname + '/database/default/' + req.params.name + '/tt.json';
    const tt_def = JSON.parse(fs.readFileSync(loc_def));
    console.log(tt_def);
});

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${username} Password: ${password}`);
});

const port = 3000
app.listen(port, () => console.log(`This app is listening on port ${port}`));