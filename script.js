mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhlbmtlbm5lZHkiLCJhIjoidjE2aTktdyJ9.gpYsw_JQAEuHlK5rAq0rsw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/stephenkennedy/cm7s27fp5001t01s0c1jgf18b',
    center: [-89.4012, 43.0731], // Center on Madison, WI
    zoom: 12
});

map.on('load', () => {
    map.addSource('madison-cycleways', {
        type: 'vector',
        url: 'mapbox://stephenkennedy.madison-cycleways'
    });

    map.addLayer({
        id: 'cycleways',
        type: 'line',
        source: 'madison-cycleways',
        'source-layer': 'cycleways',
        paint: {
            'line-width': 3,
            'line-color': [
                'match', ['get', 'cycleway_category'],
                'Dedicated Lane', '#1f78b4',
                'Shared Lane', '#ff7f00',
                '#999999' // Default
            ]
        }
    });

    // Tooltip on hover
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
    map.on('mousemove', 'cycleways', (e) => {
        const properties = e.features[0].properties;
        const description = `Category: ${properties.cycleway_category}<br>Highway: ${properties.highway}`;
        popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
    });
    map.on('mouseleave', 'cycleways', () => popup.remove());

    // Interactive legend
    const legend = document.getElementById('legend');
    const categories = ['Dedicated Lane', 'Shared Lane'];
    categories.forEach(category => {
        const item = document.createElement('div');
        item.textContent = category;
        item.style.cursor = 'pointer';
        item.onmouseover = () => {
            map.setFilter('cycleways', ['==', ['get', 'cycleway_category'], category]);
        };
        item.onmouseleave = () => {
            map.setFilter('cycleways', null);
        };
        legend.appendChild(item);
    });
});
