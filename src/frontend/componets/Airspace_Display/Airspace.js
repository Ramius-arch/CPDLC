class AirspaceDisplay {
    constructor() {
        this.container = document.getElementById('airspace-container');
        this.mapContainer = document.getElementById('map');

        this.initialize();
    }

    initialize() {
        this.loadMap();
        this.setupLayers();
        this.fetchAirspaceData();
    }

    loadMap() {
        // Assuming Leaflet.js is included
        this.map = L.map(this.mapContainer).setView([51.5074, -0.1278], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'OpenStreetMap contributors'
        }).addTo(this.map);
    }

    setupLayers() {
        // Implement layer creation based on received data
        // Example: adding a GeoJSON layer for air traffic
    }

    fetchAirspaceData() {
        fetch('/api/airspace-data')
            .then(response => response.json())
            .then(data => this.updateMapWithFeatures(data))
            .catch(error => console.error('Error fetching airspace data:', error));
    }

    updateMapWithFeatures(data) {
        // Implement logic to add features (e.g., GeoJSON) to the map
    }
}

// Initialize the airspace display when the page loads
window.addEventListener('load', () => {
    new AirspaceDisplay();
});
