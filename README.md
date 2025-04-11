# Cyclist Tracker App

A real-time cyclist tracking application using Mapbox GL JS, similar to Uber's navigation interface.

## Screenshot

![Image](https://github.com/user-attachments/assets/a441ab1d-8452-4f0e-a594-d81ce640910c)

The interface shows:

-   A clean, modern map interface with the cyclist's location highlighted by a dark blue marker
-   A pulsing purple circle around the cyclist showing their vicinity
-   A blue line representing the route path
-   Navigation controls in the top-right corner
-   Information panel at the bottom showing cyclist details (name, speed, distance, ETA)
-   Control buttons at the top to toggle simulation and following mode

## Demo

![Image](https://github.com/user-attachments/assets/77bc74f7-3b26-4f9f-882e-2aa95b6f4edc)

_Note: The demo shows the real-time tracking functionality, showing how the cyclist marker moves along the route, how the pulsing effect works, and how the information panel updates dynamically._

## Features

-   Real-time tracking of cyclist locations
-   Display of cyclist's route on the map
-   Pulsing marker to indicate cyclist's current position
-   Information panel showing cyclist's speed, distance, and ETA
-   Follow mode to keep the map centered on the cyclist
-   Simulation mode for testing without real GPS data
-   Real-time sharing of location data using Socket.IO

## Prerequisites

-   Node.js and npm installed
-   Mapbox account and access token

## Setup

1. Clone this repository
2. Install dependencies:
    ```
    npm install
    ```
3. Create a `.env` file in the root directory with your Mapbox access token:
    ```
    PORT=3000
    MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
    ```
4. Also update the Mapbox access token in `public/js/mapbox-config.js`
5. Start the server:
    ```
    npm run dev
    ```
6. Open your browser and navigate to `http://localhost:3000`

## How It Works

This application uses:

-   **Mapbox GL JS** for displaying maps and routes
-   **Socket.IO** for real-time communication between cyclists and viewers
-   **Express** for serving the web application

In a real-world scenario, the cyclist's device would send GPS coordinates to the server, which would then broadcast them to connected viewers. For demonstration purposes, this app includes a simulation mode that shows a cyclist moving along a predefined route.

## Implementation Details

### Map and Route Visualization

-   The map is rendered using Mapbox GL JS with a custom style
-   The cyclist's route is drawn as a GeoJSON LineString with custom styling
-   A pulsing circle effect is created using CSS animations to highlight the cyclist's position

### Real-time Location Updates

-   Socket.IO establishes a persistent connection between clients and server
-   When a cyclist's location changes, updates are broadcasted to all connected clients
-   The server acts as a message broker between cyclists and viewers

### UI Components

-   The cyclist marker is a custom HTML element with a pulsing animation
-   Information panel is dynamically updated with the cyclist's current stats
-   Follow mode keeps the map centered on the cyclist with smooth animations

### Simulation Mode

-   For demonstration purposes, the app simulates a cyclist moving along a predefined route
-   Each movement triggers calculations for speed, distance, and ETA
-   The simulation can be started and stopped with the control buttons

## Customization

-   Edit the `SAMPLE_ROUTE` array in `public/js/mapbox-config.js` to change the cyclist's route
-   Uncomment the `getRoute()` function call in `public/js/app.js` to fetch a real route from Mapbox Directions API
-   Adjust the cyclist's speed by modifying the `speed` property in the `CyclistTracker` class

## Real-World Implementation

For a production application, you would need to:

1. Implement user authentication
2. Secure the Socket.IO connection
3. Add proper error handling
4. Use real GPS data from a mobile device
5. Set up a database to store routes and tracking data

## License

MIT
