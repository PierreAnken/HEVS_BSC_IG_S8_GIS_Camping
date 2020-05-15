function initialize() {

    // **** Define the base tile layer ****
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var bases = {
        "Map": OpenStreetMap_Mapnik,
    };

    // **** Define the overlays ****
    var placeslayer = L.layerGroup();
    var buildingslayer = L.layerGroup();
    var camping_areaslayer = L.layerGroup();
    var poolslayer = L.layerGroup();
    var treeslayer = L.layerGroup();

    var overlays = {
        "Places": placeslayer,
        "Buildings": buildingslayer,
        "Camping Areas": camping_areaslayer,
        "Pools": poolslayer,
        "Trees": treeslayer
    };


    // **** Create the leaflet map ****
    // TODO: modify the setView
    var map = L.map('campingmap', { minZoom: 9}).setView([46.20,7.5],10);
    OpenStreetMap_Mapnik.addTo(map);


    // **** Create the elements on the map ****
    var placesfile = '/places.json';
    $.getJSON(placesfile, function(data) {
        console.log(data);
        areas = L.geoJson(data,
            { onEachFeature: addPopup, highlightSelection });
        areas.addTo(placeslayer);
    });

    var buildingsfile = '/buildings.json';
    $.getJSON(buildingsfile, function(data) {
        buildings = L.geoJson(data,
            { onEachFeature: highlightSelection });
        buildings.addTo(buildingslayer);
    });

    var campingareasfile = '/campingareas.json';
    $.getJSON(campingareasfile, function(data) {
        campingareas = L.geoJson(data,
            { onEachFeature: addPopup, highlightSelection });
        campingareas.addTo(camping_areaslayer);
    });

    var poolsfile = '/pools.json';
    $.getJSON(poolsfile, function(data) {
        pools = L.geoJson(data,
            { onEachFeature: highlightSelection });
        pools.addTo(poolslayer);
    });

    var treesfile = '/trees.json';
    $.getJSON(treesfile, function(data) {
        trees = L.geoJson(data,
            { onEachFeature: highlightSelection });
        trees.addTo(treeslayer);
    });


    // **** Add the layers to the map ****
    L.control.layers(bases, overlays).addTo(map);

    // **** Define the popup function ****
    function addPopup(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties);
        }
    }

    // **** Define the highlight functions ****
    // TODO: change the colors depending on the state
    function highlightSelection(feature, layer) {
        layer.on({ mouseover: highlight,
                   mouseout: reset,
                   click: zoom
        });
    }

    function highlight(e) {
        var layer = e.target;
        layer.setStyle({ weight: 5, color: "#00ae09", dashArray: "", fillOpacity: 0.7 });
        layer.bringToFront();
    }

    function reset(e) {
        areas.resetStyle(e.target);
        buildings.resetStyle(e.target);
        campingareas.resetStyle(e.target);
        pools.resetStyle(e.target);
        trees.resetStyle(e.target);
    }

    // **** Define the zoom feature ****
    function zoom(e) {
        map.fitBounds(e.target.getBounds());
    }


    // **** Add popup with the location ****
    // TODO: modify the function, just temporary
    var popup = L.popup();

    function displayLocation(e) {
        popup.setLatLng(e.latlng)
            .setContent("The current location is: " + e.latlng.toString())
            .openOn(map);
    }

    map.on("click", displayLocation);
}
