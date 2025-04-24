// Initialize map
const map = new mapboxgl.Map(DEFAULT_MAP_SETTINGS);

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// Variables for simulation
let cyclistPosition = 0;
let isSimulating = false;
let isFollowing = false;
let simulationInterval;
let currentRoute = null;

// Function to load GPX file from URL
async function loadGPXFromURL(url) {
    try {
        const response = await fetch(url);
        const gpxFile = await response.blob();
        currentRoute = await loadGPXRoute(map, gpxFile);
    } catch (error) {
        console.error('Error loading GPX file:', error);
    }
}

// Load GPX file automatically when page loads
// Replace 'path/to/your/file.gpx' with your actual GPX file path
// loadGPXFromURL('path/to/your/file.gpx');

// File input handler
document.getElementById('gpx-file').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            currentRoute = await loadGPXRoute(map, file);
            // Update simulation with new route
            if (isSimulating) {
                stopSimulation();
                startSimulation();
            }
        } catch (error) {
            console.error('Error loading GPX file:', error);
            alert('Error loading GPX file. Please try again.');
        }
    }
});

// Initialize the map with route and markers
map.on('load', () => {
    // Add cyclist point source
    map.addSource('cyclist', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: currentRoute ? currentRoute[0] : SAMPLE_ROUTE[0]
            },
            properties: {}
        }
    });

    // Add route source
    map.addSource('route', {
        type: 'geojson',
        data: {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: SAMPLE_ROUTE
            }
        }
    });

    // Add waypoints source
    map.addSource('waypoints', {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: WAYPOINTS.map(waypoint => ({
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

    // Add layers
    map.addLayer(ROUTE_STYLE);
    map.addLayer(PATH_RADIUS_STYLE);
    map.addLayer(WAYPOINT_STYLE);

    // Add cyclist marker
    const el = document.createElement('div');
    el.className = 'cyclist-marker';
    el.style.width = '20px';
    el.style.height = '20px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = '#2ecc71';
    el.style.border = '2px solid white';

    new mapboxgl.Marker(el)
        .setLngLat(currentRoute ? currentRoute[0] : SAMPLE_ROUTE[0])
        .addTo(map);
});

// Function to update cyclist position
function updateCyclistPosition() {
    const route = currentRoute || SAMPLE_ROUTE;
    
    if (cyclistPosition >= route.length) {
        stopSimulation();
        return;
    }

    const currentPos = route[cyclistPosition];
    
    // Update cyclist position
    map.getSource('cyclist').setData({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: currentPos
        }
    });

    // Update marker position
    document.querySelector('.cyclist-marker').style.transform = 
        `translate(${map.project(currentPos).x}px, ${map.project(currentPos).y}px)`;

    // Follow cyclist if enabled
    if (isFollowing) {
        map.setCenter(currentPos);
    }

    // Update cyclist info
    updateCyclistInfo(cyclistPosition);

    cyclistPosition++;
}

// Function to start simulation
function startSimulation() {
    if (isSimulating) return;
    
    isSimulating = true;
    cyclistPosition = 0;
    simulationInterval = setInterval(updateCyclistPosition, 1000);
}

// Function to stop simulation
function stopSimulation() {
    isSimulating = false;
    clearInterval(simulationInterval);
}

// Function to toggle follow mode
function toggleFollow() {
    isFollowing = !isFollowing;
    const followBtn = document.querySelector('.follow-btn');
    followBtn.style.backgroundColor = isFollowing ? '#00b894' : '#636e72';
}

// Function to update cyclist information
function updateCyclistInfo(position) {
    const route = currentRoute || SAMPLE_ROUTE;
    
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
} 