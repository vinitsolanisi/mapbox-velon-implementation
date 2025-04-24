// Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGV2ZWxvcGVyLXNwb3J0eiIsImEiOiJjbG9qZ2R0b2YwM2FhMmtwY2J0d2J0d2J0In0.2QZQZQZQZQZQZQZQZQZQZQ';

// Default map settings
const DEFAULT_MAP_SETTINGS = {
    container: 'map',
    style: {
        version: 8,
        sources: {
            'velon-tileset': {
                type: 'vector',
                url: `mapbox://developer-sportz.velonmap.22n3mxep`
            }
        },
        layers: [
            {
                id: 'velon-layer',
                type: 'line',
                source: 'velon-tileset',
                'source-layer': 'velonmap',
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 2
                }
            }
        ]
    },
    center: [11.4773, 43.2583], // Starting position
    zoom: 12,
    bearing: 120
};

// Function to parse GPX file
async function parseGPXFile(gpxFile) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(await gpxFile.text(), "text/xml");
    
    const trackPoints = Array.from(xmlDoc.getElementsByTagName('trkpt')).map(point => {
        return [
            parseFloat(point.getAttribute('lon')),
            parseFloat(point.getAttribute('lat'))
        ];
    });
    
    return trackPoints;
}

// Function to load and display GPX route
async function loadGPXRoute(map, gpxFile) {
    try {
        const routeCoordinates = await parseGPXFile(gpxFile);
        
        // Add GPX route source
        map.addSource('gpx-route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates
                }
            }
        });
        
        // Add GPX route layer
        map.addLayer({
            id: 'gpx-route',
            type: 'line',
            source: 'gpx-route',
            paint: {
                'line-color': '#00ff00',
                'line-width': 3,
                'line-dasharray': [2, 1]
            }
        });
        
        // Fit map to GPX route bounds
        const bounds = routeCoordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(routeCoordinates[0], routeCoordinates[0]));
        
        map.fitBounds(bounds, {
            padding: 50
        });
        
        return routeCoordinates;
    } catch (error) {
        console.error('Error loading GPX file:', error);
        throw error;
    }
}

// ... rest of your existing code ... 