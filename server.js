const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

let logs = [];

function addLog(text) {

    const line = `[${new Date().toLocaleTimeString()}] ${text}`;

    console.log(line);

    logs.push(line);

    if (logs.length > 500)
        logs.shift();

    fs.writeFileSync("logs.json", JSON.stringify(logs, null, 2));
}

app.post("/log", (req, res) => {

    if (!req.body.message)
        return res.sendStatus(400);

    addLog(req.body.message);

    res.sendStatus(200);

});

app.get("/logs", (req, res) => {

    res.json(logs);

});

app.post("/clear", (req, res) => {

    logs = [];

    fs.writeFileSync("logs.json", JSON.stringify([], null, 2));

    console.clear();
    console.log("Logs cleared.");

    res.sendStatus(200);

});

app.listen(PORT, () => {

    addLog("Logger started.");

});
