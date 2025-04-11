class CyclistTracker {
	constructor(map, route) {
		this.map = map;
		this.route = route;
		this.currentPosition = 0; // Position index in the route
		this.marker = null;
		this.isSimulating = false;
		this.socket = io();
		this.followMode = false;
		this.speed = 15; // km/h
		this.distanceTraveled = 0; // in meters

		this.setupSocketListeners();
		this.drawRoute();
		this.createMarker();
	}

	setupSocketListeners() {
		// Listen for location updates from other cyclists
		this.socket.on("cyclist-location", (data) => {
			// Update the marker position based on received data
			this.updateMarkerPosition(data.coordinates);
			this.updateCyclistInfo(data);
		});
	}

	drawRoute() {
		// Add the route as a source to the map
		this.map.addSource("route", {
			type: "geojson",
			data: {
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: this.route,
				},
			},
		});

		// Add the route layer to the map
		this.map.addLayer(ROUTE_STYLE);

		// Add source for the cyclist location
		this.map.addSource("cyclist", {
			type: "geojson",
			data: {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: this.route[0],
				},
				properties: {},
			},
		});

		// Add the path radius layer
		this.map.addLayer(PATH_RADIUS_STYLE);
	}

	createMarker() {
		// Create a custom HTML element for the marker
		const el = document.createElement("div");
		el.className = "cyclist-marker";

		// Add an inner element for the pulsing effect
		const pulse = document.createElement("div");
		pulse.className = "pulse-circle";
		el.appendChild(pulse);

		// Create the marker and add it to the map
		this.marker = new mapboxgl.Marker(el)
			.setLngLat(this.route[0])
			.addTo(this.map);

		// Create a popup but don't add it to the map yet
		this.popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false,
		}).setHTML("<h3>Cyclist</h3><p>Monterori d'arbia</p>");

		// Show popup on hover
		el.addEventListener("mouseenter", () => {
			this.marker.setPopup(this.popup);
			this.popup.addTo(this.map);
		});

		el.addEventListener("mouseleave", () => {
			this.popup.remove();
		});
	}

	startSimulation() {
		if (this.isSimulating) return;

		this.isSimulating = true;
		this.simulationInterval = setInterval(() => {
			this.moveToNextPoint();
		}, 1000); // Move every second
	}

	stopSimulation() {
		if (!this.isSimulating) return;

		this.isSimulating = false;
		clearInterval(this.simulationInterval);
	}

	moveToNextPoint() {
		if (this.currentPosition >= this.route.length - 1) {
			this.stopSimulation();
			return;
		}

		// Move to the next point in the route
		this.currentPosition++;
		const newCoords = this.route[this.currentPosition];

		// Update the marker position
		this.updateMarkerPosition(newCoords);

		// Calculate distance traveled
		if (this.currentPosition > 0) {
			const prevCoords = this.route[this.currentPosition - 1];
			const distance = this.calculateDistance(prevCoords, newCoords);
			this.distanceTraveled += distance;
		}

		// Update cyclist info
		this.updateCyclistInfo({
			coordinates: newCoords,
			speed: this.speed,
			distance: this.distanceTraveled,
			eta: this.calculateETA(),
		});

		// Emit the location update to the server
		this.socket.emit("location-update", {
			coordinates: newCoords,
			speed: this.speed,
			distance: this.distanceTraveled,
			eta: this.calculateETA(),
		});
	}

	updateMarkerPosition(coordinates) {
		// Update the marker position
		this.marker.setLngLat(coordinates);

		// Update the cyclist source data
		const cyclistSource = this.map.getSource("cyclist");
		if (cyclistSource) {
			cyclistSource.setData({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: coordinates,
				},
				properties: {},
			});
		}

		// If follow mode is enabled, center the map on the cyclist
		if (this.followMode) {
			this.map.easeTo({
				center: coordinates,
				duration: 1000,
			});
		}
	}

	toggleFollowMode() {
		this.followMode = !this.followMode;

		if (this.followMode && this.currentPosition < this.route.length) {
			// Center the map on the current position when follow mode is enabled
			this.map.easeTo({
				center: this.route[this.currentPosition],
				zoom: 16,
				duration: 1000,
			});
		}

		return this.followMode;
	}

	updateCyclistInfo(data) {
		document.getElementById(
			"cyclist-speed",
		).textContent = `${data.speed} km/h`;
		document.getElementById("cyclist-distance").textContent = `${(
			data.distance / 1000
		).toFixed(2)} km`;
		document.getElementById("cyclist-eta").textContent = data.eta;
	}

	calculateDistance(coord1, coord2) {
		// Calculate distance between two coordinates in meters using Haversine formula
		const R = 6371e3; // Earth's radius in meters
		const φ1 = this.toRadians(coord2[1]);
		const φ2 = this.toRadians(coord1[1]);
		const Δφ = this.toRadians(coord1[1] - coord2[1]);
		const Δλ = this.toRadians(coord1[0] - coord2[0]);

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return R * c;
	}

	toRadians(degrees) {
		return (degrees * Math.PI) / 180;
	}

	calculateETA() {
		// Calculate estimated time of arrival
		// Assuming constant speed, calculate remaining distance and time
		const remainingPoints = this.route.slice(this.currentPosition);
		let remainingDistance = 0;

		for (let i = 1; i < remainingPoints.length; i++) {
			remainingDistance += this.calculateDistance(
				remainingPoints[i - 1],
				remainingPoints[i],
			);
		}

		// Calculate time in hours (distance in km / speed in km/h)
		const timeInHours = remainingDistance / 1000 / this.speed;
		const hours = Math.floor(timeInHours);
		const minutes = Math.floor((timeInHours - hours) * 60);

		return `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}`;
	}
}
