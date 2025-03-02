mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/YOUR_USERNAME/YOUR_STYLE_ID',
    center: [-89.4012, 43.0731], // Center on Madison, WI
    zoom: 12
});

map.on('load', () => {
    map.addSource('madison-cycleways', {
        type: 'vector',
        url: 'mapbox://YOUR_TILES_ID'
    });

    map.addLayer({
        id: 'cycleways',
        type: 'line',
        source: 'madison-cycleways',
        'source-layer': 'YOUR_SOURCE_LAYER_NAME',
        paint: {
            'line-width': 3,
            'line-color': [
                'match', ['get', 'cycleway'],
                'track', '#1f78b4',
                'lane', '#33a02c',
                'shared', '#ff7f00',
                '#999999' // Default
            ]
        }
    });

    // Tooltip on hover
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
    map.on('mousemove', 'cycleways', (e) => {
        const properties = e.features[0].properties;
        const description = `Highway: ${properties.highway}<br>Cycleway: ${properties.cycleway || 'N/A'}`;
        popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
    });
    map.on('mouseleave', 'cycleways', () => popup.remove());

    // Interactive legend
    const legend = document.getElementById('legend');
    const categories = ['track', 'lane', 'shared'];
    categories.forEach(category => {
        const item = document.createElement('div');
        item.textContent = category;
        item.style.cursor = 'pointer';
        item.onmouseover = () => {
            map.setFilter('cycleways', ['==', ['get', 'cycleway'], category]);
        };
        item.onmouseleave = () => {
            map.setFilter('cycleways', null);
        };
        legend.appendChild(item);
    });
});
