// Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoidmVsb25tYXAiLCJhIjoiY205aWc3Y3BmMDF3bzJscGo0ZXE5bjBieSJ9.li6moIN2GBHveX4OtKsVjA';

// Initialize mapbox
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

// Map styles
const MAP_STYLES = {
	dark: 'mapbox://styles/mapbox/dark-v11',
	light: 'mapbox://styles/mapbox/light-v11',
	streets: 'mapbox://styles/mapbox/streets-v12',
	satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
	race: 'mapbox://styles/mapbox/navigation-night-v1'
};

// Default map settings
const DEFAULT_MAP_SETTINGS = {
	container: 'map',
	style: MAP_STYLES.dark,
	center: [11.4773, 43.2583],
	zoom: 12,
	bearing: 120,
	pitch: 45
};

// Route style for different themes
const ROUTE_STYLES = {
	dark: {
		'line-color': '#2ecc71',
		'line-width': 8,
		'line-opacity': 0.8
	},
	light: {
		'line-color': '#e74c3c',
		'line-width': 8,
		'line-opacity': 1
	},
	race: {
		'line-color': '#BF00FF', // Electric Purple for active route
		'line-width': 8,
		'line-opacity': 1
	},
	satellite: {
		'line-color': '#2ecc71',
		'line-width': 8,
		'line-opacity': 0.8
	}
};

// Path radius style
const PATH_RADIUS_STYLE = {
	id: 'path-radius',
	type: 'circle',
	source: 'cyclist',
	paint: {
		'circle-radius': 70,
		'circle-color': '#2ecc71',
		'circle-opacity': 0.1
	}
};

// Waypoint style
const WAYPOINT_STYLE = {
	id: 'waypoints',
	type: 'symbol',
	source: 'waypoints',
	layout: {
		'icon-image': 'circle',
		'icon-size': 0.5,
		'text-field': ['get', 'name'],
		'text-offset': [0, 1],
		'text-anchor': 'top'
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

// After map loads, add your custom tileset
const addVelonTileset = (map) => {
	map.on('load', () => {
		// Add your tileset source
		map.addSource('velon-tileset', {
			type: 'vector',
			url: 'mapbox://velonmap.22n3mxep'
		});

		// Get current style
		const currentStyle = map.getStyle().name;
		let trackColor;

		// Set track color based on style
		if (currentStyle.includes('Light')) {
			trackColor = '#2980b9'; // Blue for light mode
		} else if (currentStyle.includes('Navigation Night')) {
			trackColor = '#FFA500'; // Orange for race mode background tracks
		} else {
			trackColor = '#404040'; // Default dark grey
		}

		// Add the tileset layer
		map.addLayer({
			id: 'velon-layer',
			type: 'line',
			source: 'velon-tileset',
			'source-layer': 'tracks',
			paint: {
				'line-color': trackColor,
				'line-width': 6,
				'line-opacity': 0.8
			}
		});
	});
};

// Function to change map style
function changeMapStyle(style) {
	// Update map style
	window.map.setStyle(MAP_STYLES[style]);
	
	// Update route style after style load
	window.map.once('style.load', () => {
		// Re-add custom sources and layers
		addVelonTileset(window.map);
		
		// Re-add route source and layer
		window.map.addSource('route', {
			type: 'geojson',
			data: {
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: window.currentRoute || []
				}
			}
		});

		// Add route layer with proper style
		window.map.addLayer({
			id: 'route',
			type: 'line',
			source: 'route',
			layout: {
				'line-join': 'round',
				'line-cap': 'round'
			},
			paint: ROUTE_STYLES[style] || ROUTE_STYLES.race
		});

		// Re-add waypoints
		window.map.addSource('waypoints', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: window.currentWaypoints.map(waypoint => ({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: waypoint.coordinates
					},
					properties: {
						name: waypoint.name
					}
				}))
			}
		});

		// Re-add waypoint markers
		window.map.loadImage(
			'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
			(error, image) => {
				if (error) throw error;
				window.map.addImage('circle', image);
				window.map.addLayer(WAYPOINT_STYLE);
			}
		);
	});

	// Update active button state
	document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('active'));
	document.querySelector(`.${style}-style`).classList.add('active');
}
