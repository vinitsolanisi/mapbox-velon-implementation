// Global variables
window.map = null;
window.cyclistPosition = 0;
window.isSimulating = false;
window.isFollowing = false;
window.simulationInterval = null;
window.currentRoute = null;
window.currentWaypoints = [];
window.cyclistMarkers = []; // Array to store multiple cyclists

// Sample cyclist data
const CYCLISTS = [
	{ id: 1, name: "Rider 1", image: "https://i.pravatar.cc/150?img=1", team: "Team Alpha", country: "Italy" },
	{ id: 2, name: "Rider 2", image: "https://i.pravatar.cc/150?img=2", team: "Team Beta", country: "France" },
	{ id: 3, name: "Rider 3", image: "https://i.pravatar.cc/150?img=3", team: "Team Gamma", country: "Spain" },
	{ id: 4, name: "Rider 4", image: "https://i.pravatar.cc/150?img=4", team: "Team Delta", country: "Belgium" }
];

// Global functions
function startSimulation() {
	if (window.isSimulating) {
		stopSimulation();
		return;
	}
	
	if (!window.currentRoute || window.currentRoute.length === 0) {
		alert('Please upload a GPX file first');
		return;
	}

	console.log('Starting simulation with route:', window.currentRoute.length);
	window.isSimulating = true;
	window.cyclistPosition = 0;
	window.simulationInterval = setInterval(updateCyclistPositions, 100); // Faster updates
	document.querySelector('.simulate-btn').textContent = 'Stop Simulation';
}

function stopSimulation() {
	console.log('Stopping simulation at position:', window.cyclistPosition);
	window.isSimulating = false;
	clearInterval(window.simulationInterval);
	document.querySelector('.simulate-btn').textContent = 'Simulate Cyclist';
}

function updateCyclistPositions() {
	if (!window.currentRoute || window.cyclistPosition >= window.currentRoute.length) {
		stopSimulation();
		return;
	}

	window.cyclistMarkers.forEach((cyclistData, index) => {
		const position = (window.cyclistPosition + cyclistData.position) % window.currentRoute.length;
		const currentPos = window.currentRoute[position];
		
		// Update marker position
		cyclistData.marker.setLngLat(currentPos);

		// Update cyclist info in popup
		const speed = Math.floor(Math.random() * 10 + 25);
		const distance = ((position / window.currentRoute.length) * 100).toFixed(1);
		
		const speedEl = document.querySelector(`.speed-${cyclistData.cyclist.id}`);
		const distanceEl = document.querySelector(`.distance-${cyclistData.cyclist.id}`);
		
		if (speedEl) speedEl.textContent = speed;
		if (distanceEl) distanceEl.textContent = distance;
	});

	// Follow first cyclist if enabled
	if (window.isFollowing && window.cyclistMarkers.length > 0) {
		const firstCyclist = window.cyclistMarkers[0];
		window.map.setCenter(firstCyclist.marker.getLngLat());
	}

	window.cyclistPosition++;
}

function toggleFollow() {
	window.isFollowing = !window.isFollowing;
	const button = document.querySelector('.follow-btn');
	button.style.background = window.isFollowing ? '#e17055' : '#00b894';
	button.textContent = window.isFollowing ? 'Stop Following' : 'Follow Cyclist';
}

document.addEventListener("DOMContentLoaded", async () => {
	// Initialize the map
	window.map = new mapboxgl.Map(DEFAULT_MAP_SETTINGS);

	// Add click handlers for buttons
	document.querySelector('.simulate-btn').addEventListener('click', startSimulation);
	document.querySelector('.follow-btn').addEventListener('click', toggleFollow);

	// Wait for the map to load
	await new Promise(resolve => window.map.on('load', resolve));

	// Initialize map sources and layers
	initializeMapLayers();

	try {
		// Load the GPX file from the downloads folder
		const response = await fetch('/load-gpx');
		if (!response.ok) {
			throw new Error('Failed to load GPX file');
		}
		const gpxText = await response.text();
		
		// Create a File object from the GPX content
		const gpxFile = new File([gpxText], 'G24_T03_STRAVA.gpx', {
			type: 'application/gpx+xml'
		});

		// Load the GPX route
		await loadGPXRoute(gpxFile);
		console.log('GPX file loaded successfully on page load');
	} catch (error) {
		console.error('Error loading GPX file:', error);
	}
});

// Function to initialize map layers
function initializeMapLayers() {
	// Add custom tileset
	addVelonTileset(window.map);

	// Add navigation controls
	window.map.addControl(new mapboxgl.NavigationControl(), "top-right");
	window.map.addControl(new mapboxgl.FullscreenControl(), "top-right");

	// Add route source
	window.map.addSource('route', {
		type: 'geojson',
		data: {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: []
			}
		}
	});

	// Add route layer with increased width
	window.map.addLayer({
		id: 'route',
		type: 'line',
		source: 'route',
		layout: {
			'line-join': 'round',
			'line-cap': 'round'
		},
		paint: {
			'line-color': '#00ffcc',
			'line-width': 8,
			'line-opacity': 0.8
		}
	});

	// Add cyclist point source
	window.map.addSource('cyclist', {
		type: 'geojson',
		data: {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [0, 0]
			}
		}
	});

	// Add path radius layer
	window.map.addLayer(PATH_RADIUS_STYLE);

	// Add waypoints source
	window.map.addSource('waypoints', {
		type: 'geojson',
		data: {
			type: 'FeatureCollection',
			features: []
		}
	});

	// Load circle image for waypoints
	window.map.loadImage(
		'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
		(error, image) => {
			if (error) throw error;
			window.map.addImage('circle', image);
			window.map.addLayer(WAYPOINT_STYLE);
		}
	);
}

// Function to parse GPX file
async function parseGPXFile(gpxFile) {
	try {
		console.log('Parsing GPX file...', gpxFile.name);
		const text = await gpxFile.text();
		console.log('GPX content:', text.substring(0, 500));
		
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(text, "text/xml");
		
		// Get track points
		const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt')).map(point => {
			const lon = parseFloat(point.getAttribute('lon'));
			const lat = parseFloat(point.getAttribute('lat'));
			console.log(`Found point: [${lon}, ${lat}]`);
			return [lon, lat];
		});

		// Get waypoints from both wpt tags and named trkpt tags
		const waypointsFromWpt = Array.from(xmlDoc.getElementsByTagName('wpt')).map(wpt => ({
			coordinates: [
				parseFloat(wpt.getAttribute('lon')),
				parseFloat(wpt.getAttribute('lat'))
			],
			name: wpt.getElementsByTagName('name')[0]?.textContent || 'Waypoint'
		}));

		const waypointsFromTrkpt = Array.from(xmlDoc.getElementsByTagName('trkpt'))
			.filter(point => point.getElementsByTagName('name')[0])
			.map(point => ({
				coordinates: [
					parseFloat(point.getAttribute('lon')),
					parseFloat(point.getAttribute('lat'))
				],
				name: point.getElementsByTagName('name')[0].textContent
			}));

		// Combine both types of waypoints
		const waypoints = [...waypointsFromWpt, ...waypointsFromTrkpt];
		console.log('Found waypoints:', waypoints);
		
		console.log('GPX file parsed successfully. Points:', trackPoints.length, 'Waypoints:', waypoints.length);
		return { trackPoints, waypoints };
	} catch (error) {
		console.error('Error parsing GPX file:', error);
		throw error;
	}
}

// Function to create cyclist marker with popup
function createCyclistMarker(coordinates, cyclist, offset = 0) {
	// Create marker element
	const el = document.createElement('div');
	el.className = 'cyclist-marker';
	el.style.width = '20px';
	el.style.height = '20px';
	el.style.borderRadius = '50%';
	el.style.backgroundColor = '#2ecc71';
	el.style.border = '2px solid white';
	el.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.5)';
	el.style.cursor = 'pointer';

	// Create popup content
	const popupContent = `
		<div class="cyclist-popup">
			<img src="${cyclist.image}" alt="${cyclist.name}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 8px;">
			<h3 style="margin: 0 0 5px 0;">${cyclist.name}</h3>
			<p style="margin: 0 0 3px 0;">Team: ${cyclist.team}</p>
			<p style="margin: 0 0 3px 0;">Country: ${cyclist.country}</p>
			<p style="margin: 0;">Speed: <span class="speed-${cyclist.id}">0</span> km/h</p>
			<p style="margin: 0;">Distance: <span class="distance-${cyclist.id}">0</span> km</p>
		</div>
	`;

	// Create popup
	const popup = new mapboxgl.Popup({
		offset: 25,
		closeButton: false,
		closeOnClick: false
	}).setHTML(popupContent);

	// Create and store marker
	const marker = new mapboxgl.Marker(el)
		.setLngLat(coordinates)
		.setPopup(popup)
		.addTo(window.map);

	// Show popup on hover
	el.addEventListener('mouseenter', () => popup.addTo(window.map));
	el.addEventListener('mouseleave', () => popup.remove());

	return {
		marker,
		position: offset,
		cyclist,
		popup,
		el
	};
}

// Function to load and display GPX route
async function loadGPXRoute(gpxFile) {
	try {
		console.log('Loading GPX route...');
		const { trackPoints, waypoints } = await parseGPXFile(gpxFile);
		
		if (!trackPoints || trackPoints.length === 0) {
			throw new Error('No valid coordinates found in GPX file');
		}

		// Update the route source
		const routeSource = window.map.getSource('route');
		if (routeSource) {
			routeSource.setData({
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: trackPoints
				}
			});
		}

		// Center the map on the route
		const bounds = new mapboxgl.LngLatBounds();
		trackPoints.forEach(point => bounds.extend(point));
		window.map.fitBounds(bounds, {
			padding: 50
		});

		// Update waypoints
		window.currentWaypoints = waypoints;
		const waypointsSource = window.map.getSource('waypoints');
		if (waypointsSource) {
			waypointsSource.setData({
				type: 'FeatureCollection',
				features: waypoints.map(waypoint => ({
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: waypoint.coordinates
					},
					properties: {
						name: waypoint.name
					}
				}))
			});
		}

		// Remove existing cyclists
		window.cyclistMarkers.forEach(data => data.marker.remove());
		window.cyclistMarkers = [];

		// Create multiple cyclists with different offsets
		CYCLISTS.forEach((cyclist, index) => {
			const offset = index * 50;
			const markerData = createCyclistMarker(trackPoints[0], cyclist, offset);
			window.cyclistMarkers.push(markerData);
		});

		console.log('GPX route loaded successfully');
		window.currentRoute = trackPoints;
		return trackPoints;
	} catch (error) {
		console.error('Error loading GPX route:', error);
		throw error;
	}
}

// File input handler
document.getElementById('gpx-file').addEventListener('change', async (event) => {
	console.log('File input changed');
	const file = event.target.files[0];
	if (file) {
		try {
			console.log('Processing file:', file.name);
			// Wait for map to be ready
			if (!window.map.loaded()) {
				await new Promise(resolve => window.map.once('load', resolve));
			}
			await loadGPXRoute(file);
			// Reset simulation
			if (window.isSimulating) {
				stopSimulation();
			}
			window.cyclistPosition = 0;
		} catch (error) {
			console.error('Error processing GPX file:', error);
			alert('Error loading GPX file. Please check the console for details.');
		}
	}
});

function updateCyclistInfo(position, route) {
	// Calculate speed (random between 25-35 km/h)
	const speed = Math.floor(Math.random() * 10 + 25);
	document.getElementById('cyclist-speed').textContent = `${speed} km/h`;

	// Calculate distance (rough estimate)
	const distance = (position / route.length * 100).toFixed(1);
	document.getElementById('cyclist-distance').textContent = `${distance} km`;

	// Calculate ETA (rough estimate)
	const remainingPoints = route.length - position;
	const remainingMinutes = Math.floor(remainingPoints * 0.5);
	const hours = Math.floor(remainingMinutes / 60);
	const minutes = remainingMinutes % 60;
	document.getElementById('cyclist-eta').textContent = 
		`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

	// Update cyclist name based on nearest waypoint
	const waypoints = window.currentWaypoints.length > 0 ? window.currentWaypoints : WAYPOINTS;
	const nearestWaypoint = findNearestWaypoint(route[position], waypoints);
	if (nearestWaypoint) {
		document.getElementById('cyclist-name').textContent = nearestWaypoint.name;
	}
}

// Function to find nearest waypoint
function findNearestWaypoint(position, waypoints) {
	if (!waypoints || waypoints.length === 0) return null;
	
	return waypoints.reduce((nearest, waypoint) => {
		const d1 = distance(position, waypoint.coordinates);
		const d2 = nearest ? distance(position, nearest.coordinates) : Infinity;
		return d1 < d2 ? waypoint : nearest;
	}, null);
}

// Function to calculate distance between two points
function distance(point1, point2) {
	const [lon1, lat1] = point1;
	const [lon2, lat2] = point2;
	return Math.sqrt(Math.pow(lon2 - lon1, 2) + Math.pow(lat2 - lat1, 2));
}
