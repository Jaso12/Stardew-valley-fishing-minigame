import { fileURLToPath } from 'url';
import cors from 'cors';
import path from 'path';
import express from 'express';
import Game from './game.js';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
const publicFolder = path.join(__dirname, '../public');
app.use(express.static(publicFolder));

const wss = new WebSocketServer({ port: 8080 });
let clients = [];

// websockets
wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');
    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });
});

const broadcast = (message) => {
    const strMessage = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(strMessage);
        }
    });
};

const game = Game(broadcast);

// endpoints

app.get('/cast_line', (req, res) => {
    const result = game.castLine();
    if (result) {
        res.status(400).json({ errorCode: result });
    } else {
        res.sendStatus(200);
    }
});

// wait_for_bite endpoint
app.get('/wait_for_bite', async (req, res) => {
    try {
        await game.waitForBite();
        res.sendStatus(200);
    } catch (error) {
        res.status(400).json({ errorCode: error });
    }
});

// reel_in endpoint
app.get('/reel_in', (req, res) => {
    const result = game.reelIn();
    if (result.errorCode) {
        res.status(400).json(result);
    } else if (result.difficulty) {
        res.status(200).json(result);
    }
});

//get_mini_game_info endpoint
app.get('/get_mini_game_info', (req, res) => {
    const info = game.getCatchingMiniGameInfo();
    res.status(200).json(info);
});

// move_catch_bar_up endpoint 
app.get('/move_catch_bar_up', (req, res) => {
    game.updateCatchBarDirection("up");
    res.sendStatus(200);
});

// stop_moving_catch_bar endpoint
app.get('/stop_moving_catch_bar_up', (req, res) => {
    game.updateCatchBarDirection("down");
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});
