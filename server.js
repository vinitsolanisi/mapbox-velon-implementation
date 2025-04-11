require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Socket.io connection
io.on("connection", (socket) => {
	console.log("New client connected");

	// Listen for location updates from the cyclist
	socket.on("location-update", (data) => {
		// Broadcast the location to all connected clients except the sender
		socket.broadcast.emit("cyclist-location", data);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
