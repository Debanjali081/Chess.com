const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("index");
});

io.on("connection", (uniqueSocket) => {
    // Assign player roles
    if (!players.white) {
        players.white = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = uniqueSocket.id;
        uniqueSocket.emit("playerRole", "b");
    } else {
        uniqueSocket.emit("spectatorRole");
        uniqueSocket.emit("boardState", chess.fen());
    }

    // Handle player disconnection
    uniqueSocket.on("disconnect", () => {
        if (uniqueSocket.id === players.white) {
            delete players.white;
        } else if (uniqueSocket.id === players.black) {
            delete players.black;
        }
    });

    // Handle moves
    uniqueSocket.on("move", (move) => {
        try {
            // Validate player turn
            if ((chess.turn() === 'w' && uniqueSocket.id !== players.white) || 
                (chess.turn() === 'b' && uniqueSocket.id !== players.black)) {
                return uniqueSocket.emit("invalidMove", { move, reason: "Not your turn." });
            }

            // Attempt the move
            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                uniqueSocket.emit("invalidMove", { move, reason: "Move not allowed by chess rules." });
            }
        } catch (error) {
            console.error("Move error:", error.message);
            uniqueSocket.emit("invalidMove", { move, reason: "Server error processing move." });
        }
    });
});

server.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});

