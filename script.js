mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhlbmtlbm5lZHkiLCJhIjoidjE2aTktdyJ9.gpYsw_JQAEuHlK5rAq0rsw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/stephenkennedy/cm7s27fp5001t01s0c1jgf18b',
    center: [-89.4012, 43.0731], // Center on Madison, WI
    zoom: 12
});

map.on('load', () => {
    map.addSource('madison-cycleways-OSM', {
        type: 'vector',
        url: 'mapbox://stephenkennedy.madison-cycleways'
    });

    map.addLayer({
        'id': 'shared-lane-right',
        'type': 'line',
        'source': 'madison-cycleways-OSM',
        'source-layer': 'cycleways',
        'slot': 'middle',
        'filter': [
            'any',
            ['==', ['get', 'cycleway:right'], 'shared_lane'],
            ['==', ['get', 'cycleway:right'], 'share_busway'],
            ['==', ['get', 'cycleway:both'], 'shared_lane'],
            ['==', ['get', 'cycleway:both'], 'share_busway'],
            ['==', ['get', 'cycleway'], 'shared_lane'],
            ['==', ['get', 'cycleway'], 'share_busway'],
            ['==', ['get', 'cyclestreet'], 'yes'],
            [
                'all',
                ['==', ['get', 'oneway'], 'yes'],
                ['==', ['get', 'cycleway'], 'shared_lane']
            ],
            [
                'all',
                ['==', ['get', 'oneway'], 'yes'],
                ['==', ['get', 'cycleway'], 'share_busway']
            ]
        ],
        'paint': {
            'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                0.25,
                14,
                2,
                22,
                3
            ],
            'line-color': '#9ca9e5',
            'line-dasharray': [2, 1],
            'line-offset': 2
        }
    });

});
