// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
	// Initialize the map
	const map = new mapboxgl.Map(DEFAULT_MAP_SETTINGS);

	// Wait for the map to load
	map.on("load", () => {
		// Initialize the cyclist tracker with the map and sample route
		const cyclistTracker = new CyclistTracker(map, SAMPLE_ROUTE);

		// Add navigation controls to the map
		map.addControl(new mapboxgl.NavigationControl(), "top-right");
		map.addControl(new mapboxgl.FullscreenControl(), "top-right");
		map.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			}),
			"top-right",
		);

		// Set up event listeners for buttons
		const simulateBtn = document.getElementById("simulate-btn");
		const followBtn = document.getElementById("follow-btn");

		simulateBtn.addEventListener("click", () => {
			if (!cyclistTracker.isSimulating) {
				cyclistTracker.startSimulation();
				simulateBtn.textContent = "Stop Simulation";
			} else {
				cyclistTracker.stopSimulation();
				simulateBtn.textContent = "Simulate Cyclist";
			}
		});

		followBtn.addEventListener("click", () => {
			const isFollowing = cyclistTracker.toggleFollowMode();
			followBtn.textContent = isFollowing
				? "Unfollow Cyclist"
				: "Follow Cyclist";
		});

		// Alternative way to get a real route using Mapbox Directions API
		// This would typically be done on the server side
		// This is just for demonstration purposes
		function getRoute() {
			// Use Mapbox Directions API to get a route
			const start = SAMPLE_ROUTE[0];
			const end = SAMPLE_ROUTE[SAMPLE_ROUTE.length - 1];

			const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${ACCESS_TOKEN}`;

			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					const route = data.routes[0];
					const coordinates = route.geometry.coordinates;

					// If you want to use this route instead of the sample one:
					// cyclistTracker.route = coordinates;
					// cyclistTracker.drawRoute();
					console.log(
						"Route fetched from Directions API:",
						coordinates,
					);
				});
		}

		// Uncomment this to use the real route instead of the sample one
		// getRoute();
	});
});
