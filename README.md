# Cyclist Tracker App

A real-time cyclist tracking application using Mapbox GL JS, similar to Uber's navigation interface.

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
