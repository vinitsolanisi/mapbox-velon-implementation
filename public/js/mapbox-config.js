// Mapbox access token
const ACCESS_TOKEN = "pk.eyJ1IjoidmVsb25tYXAiLCJhIjoiY205aWc3Y3BmMDF3bzJscGo0ZXE5bjBieSJ9.li6moIN2GBHveX4OtKsVjA"; // Replace with your actual token

// Initialize mapbox
mapboxgl.accessToken = ACCESS_TOKEN;

// Default map settings
const DEFAULT_MAP_SETTINGS = {
	container: "map",
	style: "mapbox://styles/mapbox/dark-v11",
	center: [11.4950, 43.2570],
	zoom: 13,
	pitch: 45,
	bearing: 120 // Rotated 120 degrees to match desired view
};

// Route style properties
const ROUTE_STYLE = {
	id: "route",
	type: "line",
	source: "route",
	layout: {
		"line-join": "round",
		"line-cap": "round"
	},
	paint: {
		"line-color": "#6171e5",
		"line-width": 3,
		"line-opacity": 0.8,
		"line-dasharray": [2, 1]
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

// Waypoint marker style
const WAYPOINT_STYLE = {
	id: "waypoints",
	type: "symbol",
	source: "waypoints",
	layout: {
		"text-field": ["get", "name"],
		"text-size": 12,
		"text-offset": [0, 1.5],
		"text-anchor": "top",
		"icon-image": "circle",
		"icon-size": 0.5
	},
	paint: {
		"text-color": "#2ecc71",
		"text-halo-color": "#000000",
		"text-halo-width": 1
	}
};

// Sample route coordinates with smooth turns
const SAMPLE_ROUTE = [
	[11.4773, 43.2583], // Start of route
	// First down movement with smooth transition
	[11.4773, 43.2577],
	[11.4773, 43.2570],
	[11.4773, 43.2565],
	[11.4773, 43.2560],
	// Smooth right curve
	[11.4778, 43.2560],
	[11.4783, 43.2560],
	[11.4790, 43.2560],
	[11.4795, 43.2560],
	[11.4800, 43.2560],
	// Smooth upward curve
	[11.4800, 43.2565],
	[11.4800, 43.2570],
	[11.4800, 43.2575],
	[11.4800, 43.2580],
	// Smooth right curve to Borgo Vercelli
	[11.4810, 43.2580],
	[11.4820, 43.2580],
	[11.4830, 43.2580],
	[11.4840, 43.2580], // Borgo Vercelli
	// Smooth downward curve
	[11.4840, 43.2575],
	[11.4840, 43.2570],
	[11.4840, 43.2565],
	[11.4840, 43.2560],
	// Smooth right curve
	[11.4850, 43.2560],
	[11.4860, 43.2560],
	[11.4870, 43.2560],
	[11.4880, 43.2560],
	// Smooth upward curve to Vercelli
	[11.4880, 43.2565],
	[11.4880, 43.2570],
	[11.4880, 43.2575],
	[11.4880, 43.2580], // Vercelli
	// Smooth right curve
	[11.4890, 43.2580],
	[11.4900, 43.2580],
	[11.4910, 43.2580],
	[11.4920, 43.2580],
	// Smooth downward curve to Stroppiena
	[11.4920, 43.2575],
	[11.4920, 43.2570],
	[11.4920, 43.2565],
	[11.4920, 43.2560], // Stroppiena
	// Smooth right curve
	[11.4930, 43.2560],
	[11.4940, 43.2560],
	[11.4950, 43.2560],
	[11.4960, 43.2560],
	// Smooth upward curve to Villanova
	[11.4960, 43.2565],
	[11.4960, 43.2570],
	[11.4960, 43.2575],
	[11.4960, 43.2580], // Villanova
	// Smooth right curve
	[11.4970, 43.2580],
	[11.4980, 43.2580],
	[11.4990, 43.2580],
	[11.5000, 43.2580],
	// Smooth downward curve to Galleria
	[11.5000, 43.2575],
	[11.5000, 43.2570],
	[11.5000, 43.2565],
	[11.5000, 43.2560], // Galleria
	// Smooth right curve
	[11.5010, 43.2560],
	[11.5020, 43.2560],
	[11.5030, 43.2560],
	[11.5040, 43.2560],
	// Smooth upward curve to Occimiano
	[11.5040, 43.2565],
	[11.5040, 43.2570],
	[11.5040, 43.2575],
	[11.5040, 43.2580], // Occimiano
	// Smooth right curve
	[11.5050, 43.2580],
	[11.5060, 43.2580],
	[11.5070, 43.2580],
	[11.5080, 43.2580],
	// Smooth downward curve to Mirabello
	[11.5080, 43.2575],
	[11.5080, 43.2570],
	[11.5080, 43.2565],
	[11.5080, 43.2560], // Mirabello
	// Smooth right curve
	[11.5090, 43.2560],
	[11.5100, 43.2560],
	[11.5110, 43.2560],
	[11.5120, 43.2560],
	// Smooth upward curve to Monterrato
	[11.5120, 43.2565],
	[11.5120, 43.2570],
	[11.5120, 43.2575],
	[11.5120, 43.2580], // Monterrato
	// Smooth right curve
	[11.5130, 43.2580],
	[11.5140, 43.2580],
	[11.5150, 43.2580],
	[11.5160, 43.2580],
	// Smooth downward curve to KM_100
	[11.5160, 43.2575],
	[11.5160, 43.2570],
	[11.5160, 43.2565],
	[11.5160, 43.2560] // KM_100
];

// Update waypoint coordinates
const WAYPOINTS = [
	{
		coordinates: [11.4773, 43.2583],
		name: "Start of route"
	},
	{
		coordinates: [11.4840, 43.2580],
		name: "Borgo Vercelli"
	},
	{
		coordinates: [11.4880, 43.2580],
		name: "Vercelli"
	},
	{
		coordinates: [11.4920, 43.2560],
		name: "Stroppiena"
	},
	{
		coordinates: [11.4960, 43.2580],
		name: "Villanova"
	},
	{
		coordinates: [11.5000, 43.2560],
		name: "Galleria"
	},
	{
		coordinates: [11.5040, 43.2580],
		name: "Occimiano"
	},
	{
		coordinates: [11.5080, 43.2560],
		name: "Mirabello"
	},
	{
		coordinates: [11.5120, 43.2580],
		name: "Monterrato"
	},
	{
		coordinates: [11.5160, 43.2560],
		name: "KM_100"
	}
];
