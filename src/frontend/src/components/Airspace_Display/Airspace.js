export function initializeAirspace() {
    const airspaceDisplay = document.querySelector('.airspace-display');
    airspaceDisplay.innerHTML = `
        <div class="airspace">
            <h2>Airspace Display</h2>
            <div class="map-container">
                <!-- Map will be initialized here -->
            </div>
        </div>
    `;
}