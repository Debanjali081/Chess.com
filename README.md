﻿# Chess Game

A real-time multiplayer chess game built with **Node.js**, **Express**, **Socket.io**, and **Chess.js**. The application provides a user-friendly interface for playing chess online with other players or as a spectator.

## Features
- **Real-Time Gameplay**: Players interact in real time via Socket.io.
- **Drag-and-Drop Interface**: Easy-to-use chessboard with drag-and-drop functionality.
- **Chess Rules Enforcement**: Moves are validated using Chess.js.
- **Spectator Mode**: Additional users can watch the game in progress.

---

## Folder Structure
```
Chess Game
├── node_modules
├── public
│   ├── css
│   ├── js
│   │   └── chessGame.js
├── views
│   └── index.ejs
├── .gitignore
├── app.js
├── backendSetup.yaml
├── frontendSetup.yaml
├── package.json
├── package-lock.json
```

---

## Getting Started

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/chess-game.git
    ```
2. Navigate to the project directory:
    ```bash
    cd chess-game
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

---

## Usage

### Run the Server
Start the application with the following command:
```bash
node app.js
```
The server will start at `http://localhost:3000`.

### Playing the Game
1. Open the URL `http://localhost:3000` in two separate browser tabs or devices.
2. The first user will be assigned the **white** pieces, and the second user will be assigned the **black** pieces.
3. Additional users joining the URL will enter as spectators.

---

## Project Structure

### `app.js`
Handles the backend setup for the game, including:
- **Express.js** for serving static files and rendering the `index.ejs` template.
- **Socket.io** for managing WebSocket communication.
- **Chess.js** for validating moves and enforcing chess rules.

### `public/js/chessGame.js`
Handles the frontend logic for:
- Rendering the chessboard and pieces dynamically.
- Managing drag-and-drop functionality for moves.
- Communicating with the server via Socket.io.

### `views/index.ejs`
The HTML structure of the chessboard, rendered with **EJS**.

---

## Example Output
### Game Interface
A visually appealing chessboard with light and dark squares, updated dynamically based on player moves.

### Server Logs
```bash
Server started on http://localhost:3000
```

---

## Dependencies
- **express**: Web framework for Node.js.
- **socket.io**: Real-time WebSocket library.
- **chess.js**: Library for handling chess game logic.
- **ejs**: Template engine for rendering views.

Install all dependencies via:
```bash
npm install
```

---

## Future Enhancements
- Add persistent game state with a database.
- Implement user authentication.
- Allow spectators to chat during the game.
- Add support for custom time controls and game settings.

---

