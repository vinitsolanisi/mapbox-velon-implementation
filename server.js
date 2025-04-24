require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require('fs').promises;
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Endpoint to load GPX file
app.get('/load-gpx', async (req, res) => {
	try {
		const downloadsPath = path.join(os.homedir(), 'Downloads');
		const gpxPath = path.join(downloadsPath, 'G24_T03_STRAVA.gpx');
		const gpxContent = await fs.readFile(gpxPath, 'utf8');
		res.type('application/gpx+xml').send(gpxContent);
	} catch (error) {
		console.error('Error reading GPX file:', error);
		res.status(500).send('Error loading GPX file');
	}
});

// Socket.io connection
io.on("connection", (socket) => {
	console.log("A user connected");

	// Listen for location updates from the cyclist
	socket.on("location-update", (data) => {
		// Broadcast the location to all connected clients except the sender
		socket.broadcast.emit("cyclist-location", data);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
