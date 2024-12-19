const express = require('express');
const socket = require('socket.io');
const hhtp = require('http');
const { Chess } = require('chess.js');
const path = require('path');



const app = express();


const server = hhtp.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("index")
})

io.on("connection", ((uniqueSocket) => {
    console.log("Connected");
}))

if (!players.white) {
    players.white = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "W");
}
else if (!players.black) {
    players.black = uniqueSocket.id;
    uniqueSocket.emit("playerRole", "B");
}
else {
    uniqueSocket.emit("spectatorRole")
}


uniqueSocket.on("disconnect", () => {
    if (uniqueSocket.id === players.white) {
        delete players.white;
    }
    else if (uniqueSocket.id === players.black) {
        delete players.black;
    }
})

uniqueSocket.on("move", (move) => {
    try {
        if (chess.turn() === 'w' && uniqueSocket.id !== players.white) return;
        if (chess.turn() === 'b' && uniqueSocket.id !== players.black) return;

        const result = chess.move(move);
        if (result) {
            currentPlayer = chess.turn();
            io.emit("move", move);
            io.emit("boardState", chess.fen());
        }
        else {
            console.log("Invalid Move : ", move);
            uniqueSocket.emit("invalidMove", move)
        }

    } catch (error) {
        console.log(error.message);
        uniqueSocket.emit("Invalid Move : ", move)
    }
});


server.listen(3000, () => {
    console.log("Server get started!!");

})

