/* ===============================================================================
   LEAFLET MAP INTEGRATION
   =============================================================================== */

let mapInstance = null;
let mapMarkersGroup = null;

function initLeafletMap(countriesData, layerType = 'cases') {
  const mapElement = document.getElementById('mapContainer');
  if (!mapElement) return;

  // Initialize map if not existing
  if (!mapInstance) {
    mapInstance = L.map('mapContainer', {
      center: [20, 0],
      zoom: 2.2,
      minZoom: 2,
      maxZoom: 7,
      zoomControl: true
    });

    // Dark Matter tile layer by CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(mapInstance);

    mapMarkersGroup = L.layerGroup().addTo(mapInstance);
  } else {
    mapMarkersGroup.clearLayers();
  }

  // Render glowing circle markers for each country
  countriesData.forEach(country => {
    const lat = country.lat;
    const long = country.long;
    if (!lat || !long) return;

    let radius = 15;
    let color = '#00f2fe';
    let fillOpacity = 0.5;

    if (layerType === 'cases') {
      radius = Math.max(12, Math.min(45, (country.totalCases / 3000000)));
      color = '#00f2fe';
    } else if (layerType === 'cfr') {
      radius = Math.max(12, Math.min(40, country.caseFatalityRate * 12));
      color = '#ff5252';
    } else if (layerType === 'vax') {
      radius = Math.max(12, Math.min(40, country.pctVaccinated * 0.45));
      color = '#00e676';
    }

    const circle = L.circleMarker([lat, long], {
      radius: radius,
      fillColor: color,
      color: color,
      weight: 1.5,
      opacity: 0.9,
      fillOpacity: fillOpacity
    });

    // Glass popup card content
    const popupContent = `
      <div style="font-family: 'Inter', sans-serif; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; margin-bottom: 8px;">
          <strong style="font-family: 'Outfit'; font-size: 1rem; color: #fff;">${country.name} (${country.code})</strong>
          <span style="font-size: 0.72rem; color: #94a3b8; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">${country.region}</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.82rem;">
          <div>
            <span style="color: #94a3b8; font-size: 0.75rem;">Total Cases</span><br>
            <strong style="color: #00f2fe; font-size: 0.95rem;">${country.totalCases.toLocaleString()}</strong>
          </div>
          <div>
            <span style="color: #94a3b8; font-size: 0.75rem;">Total Deaths</span><br>
            <strong style="color: #ff5252; font-size: 0.95rem;">${country.totalDeaths.toLocaleString()}</strong>
          </div>
          <div>
            <span style="color: #94a3b8; font-size: 0.75rem;">Fatality Rate</span><br>
            <strong style="color: #ffab00;">${country.caseFatalityRate}%</strong>
          </div>
          <div>
            <span style="color: #94a3b8; font-size: 0.75rem;">Vaccinated %</span><br>
            <strong style="color: #00e676;">${country.pctVaccinated}%</strong>
          </div>
        </div>
      </div>
    `;

    circle.bindPopup(popupContent);
    mapMarkersGroup.addLayer(circle);
  });
}
