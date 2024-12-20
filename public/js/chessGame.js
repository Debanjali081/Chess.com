// Initialize chess.js and Socket.io
const chess = new Chess();
const socket = io();
const boardElement = document.querySelector('.chessboard');

// Track the currently dragged piece and the player role
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// Function to render the chessboard
const renderBoard = () => {
    const board = chess.board(); // Get the board as a 2D array
    boardElement.innerHTML = ""; // Clear the current board rendering

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            // Create a square element for each cell
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
            );
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            // Add the chess piece to the square if it exists
            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color; // Enable drag only for the player's pieces

                // Handle drag events for the piece
                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", ""); // Required for drag to work
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.appendChild(pieceElement); // Add the piece to the square
            }

            // Handle dragover and drop events for the square
            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault(); // Allow drop
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSquare = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };
                    handleMove(sourceSquare, targetSquare);
                }
            });

            boardElement.appendChild(squareElement); // Add the square to the board
        });
    });
};

// Function to handle moves
const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: "q", // Auto-promote to queen (can be adjusted for user input)
    };

    socket.emit("move", move); // Send the move to the server
};

// Function to get the Unicode symbol for a piece
const getPieceUnicode = (piece) => {
    const unicodePieces = {
        p: "♟",
        r: "♜",
        n: "♞",
        b: "♝",
        q: "♛",
        k: "♚",
        P: "♙",
        R: "♖",
        N: "♘",
        B: "♗",
        Q: "♕",
        K: "♔",
    };
    return unicodePieces[piece.type] || "";
};

// Handle player role assignment from the server
socket.on("playerRole", (role) => {
    playerRole = role;
    renderBoard();
});

// Handle spectator role assignment
socket.on("spectatorRole", () => {
    playerRole = null; // Spectators cannot interact with the board
    renderBoard();
});

// Update the board state when received from the server
socket.on("boardState", (fen) => {
    chess.load(fen); // Load the FEN string into the chess.js instance
    renderBoard();
});

// Handle move events broadcasted from the server
socket.on("move", (move) => {
    chess.move(move); // Apply the move to the local board
    renderBoard();
});

// Handle invalid move messages
socket.on("invalidMove", (data) => {
    console.log(`Invalid move: ${data.move.from} -> ${data.move.to}. Reason: ${data.reason}`);
});

// Render the initial board
renderBoard();



