console.log("LOADED TMCF3X LOGGER SERVER");

const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


let logs = [];

let serverInfo = {
    jobId: "Unknown",
    players: 0,
    maxPlayers: 0,
    placeId: "Unknown",
    started: new Date().toISOString()
};


// Receive Roblox logs
app.post("/log", (req, res) => {

    const log = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        ...req.body
    };

    logs.push(log);

    if (logs.length > 500) {
        logs.shift();
    }

    console.log(
        `[${log.type}] ${log.player || ""}: ${log.message || log.text || ""}`
    );

    res.json({
        success: true
    });

});


// Receive server information
app.post("/info", (req, res) => {

    serverInfo = {
        ...serverInfo,
        ...req.body
    };

    console.log("Server info updated");

    res.json({
        success: true
    });

});


// Dashboard gets logs
app.get("/logs", (req, res) => {

    res.json(logs);

});


// Dashboard gets server info
app.get("/info", (req, res) => {

    res.json(serverInfo);

});


// Clear dashboard logs
app.post("/clear", (req, res) => {

    logs = [];

    console.log("Logs cleared");

    res.json({
        success: true
    });

});


// Reset server information
app.post("/reset-server", (req, res) => {

    serverInfo = {
        jobId: "Unknown",
        players: 0,
        maxPlayers: 0,
        placeId: "Unknown",
        started: new Date().toISOString()
    };

    logs.push({
        id: Date.now(),
        type: "system",
        message: "Server info was reset",
        timestamp: new Date().toLocaleTimeString()
    });

    console.log("Server info reset");

    res.json({
        success: true
    });

});


// Health check for Railway
app.get("/", (req, res) => {

    res.send("Roblox Logger Online");

});


app.get("/test", (req, res) => {
    res.send("Test route works");
});


app.get("/routes", (req, res) => {

    res.json({
        routes: [
            "POST /log",
            "POST /info",
            "GET /logs",
            "GET /info",
            "POST /clear",
            "POST /reset-server",
            "GET /test"
        ]
    });

});


app.listen(PORT, "0.0.0.0", () => {

    console.log(
        "Roblox Logger running on port " + PORT
    );

});
