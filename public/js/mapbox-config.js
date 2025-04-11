// Mapbox access token
const ACCESS_TOKEN = "update_your_mapbox_access_token"; // Replace with your actual token

// Initialize mapbox
mapboxgl.accessToken = ACCESS_TOKEN;

// Default map settings
const DEFAULT_MAP_SETTINGS = {
	container: "map",
	style: "mapbox://styles/mapbox/streets-v12",
	center: [11.516, 43.2583], // Default center (Monteroni d'Arbia, Italy)
	zoom: 15,
	pitch: 45, // Gives a 3D-like view
	bearing: 0,
};

// Route style properties
const ROUTE_STYLE = {
	id: "route",
	type: "line",
	source: "route",
	layout: {
		"line-join": "round",
		"line-cap": "round",
	},
	paint: {
		"line-color": "#6171e5",
		"line-width": 5,
		"line-opacity": 0.8,
	},
};

// Path radius style (the circular area around the cyclist)
const PATH_RADIUS_STYLE = {
	id: "path-radius",
	type: "circle",
	source: "cyclist",
	paint: {
		"circle-radius": 70,
		"circle-color": "#6171e5",
		"circle-opacity": 0.2,
	},
};

// Sample route coordinates (from the image, approximating a route near Monteroni d'Arbia)
// These would typically come from your backend or directions API
const SAMPLE_ROUTE = [
	[11.5099, 43.257], // Start point
	[11.511, 43.2575],
	[11.512, 43.258],
	[11.513, 43.2585],
	[11.514, 43.259],
	[11.515, 43.2595],
	[11.516, 43.26],
	[11.517, 43.2605],
	[11.518, 43.261],
	[11.519, 43.2615],
	[11.52, 43.262], // End point
];
