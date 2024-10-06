require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require("node:http");
const eventEmitter = require('events').EventEmitter;
const PORT = process.env.PORT || 8000;

const event = new eventEmitter();

event.on('log', (message) =>{
    console.log('[You connected succesfully]', "Type: ", message);
});

const middleware = (req, res, next) => {
    const logMessage = `${req.method} ${req.originalUrl}`;
    event.emit('log', logMessage);
    next();
};
//endte ikke med at bruge statiske filer
app.use(express.static(path.join(__dirname,'../view')));

app.use(middleware);

app.use(express.json());

app.get('/read-file', (req, res) =>{
    fs.readFile('data.txt', 'utf8', (err, data) => {
        if(err){
            console.error(err);
            if (err.code === 'ENOENT') {
                return res.status(404).send('Error: File not found');
            }
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(data)
        console.log(data);
    });
});

app.post('/write-file', (req, res) => {
    const fileContent = req.body.content;

    if (fileContent === undefined) {
        console.log("Post had no content");
        return res.status(400).send('Error: Content is required');
    }

    if (typeof fileContent !== 'string') {
        console.log("Post must be a string");
        return res.status(400).send('Error: Content must be a string');
    }

    fs.writeFile('data.txt', fileContent, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        console.log("Data written: " + fileContent);
        res.send('File written successfully');
    });
});

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.log("Error: Invalid JSON");
        return res.status(400).send('Error: Invalid JSON');
    }
    next();
});


app.get('/', (req, res) =>{
    res.send('Hello world')
});

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`);
});
