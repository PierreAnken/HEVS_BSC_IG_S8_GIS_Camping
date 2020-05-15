function initialize() {

    // **** Define the base tile layer ****
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
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
    var map = L.map('campingmap', {minZoom: 1}).setView([46.20, 7.5], 10);
    OpenStreetMap_Mapnik.addTo(map);

    let placesfile = '/places.json'
    $.getJSON(placesfile, function (data) {
        places = L.geoJSON(data,
            {
                onEachFeature: addPopup, highlightSelection, coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[0], coords[1], coords[2]);
                }
            });
        places.addTo(map);
    })

    let buildingsfile = '/buildings.json'
    $.getJSON(buildingsfile, function (data) {
        buildings = L.geoJSON(data,
            {
                onEachFeature: addPopup, highlightSelection, coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[0], coords[1], coords[2]);
                }
            });
        buildings.addTo(map);
    })

    let campingareasfile = '/campingareas.json';
    $.getJSON(campingareasfile, function (data) {
        campingareas = L.geoJSON(data,
            {
                onEachFeature: addPopup, highlightSelection, coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[0], coords[1], coords[2]);
                }
            });
        campingareas.addTo(map);
    })

   let poolsfile = '/pools.json';
    $.getJSON(poolsfile, function (data) {
        pools = L.geoJSON(data,
            {
                onEachFeature: addPopup, highlightSelection, coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[0], coords[1], coords[2]);
                }
            });
        pools.addTo(map);
    })

    let treesfile = '/trees.json';
    $.getJSON(treesfile, function (data) {
        trees = L.geoJSON(data,
            {
                onEachFeature: addPopup, highlightSelection, coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[0], coords[1], coords[2]);
                }
            });
        trees.addTo(map);
    })
    function highlightSelection(feature, layer) {
        layer.on({
            mouseover: highlight,
            mouseout: reset,
            click: zoom
        });
    }


    // **** Define the popup function ****
    function addPopup(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
    }

    // **** Define the highlight functions ****
    // TODO: change the colors depending on the state


    function highlight(e) {
        let layer = e.target;
        layer.setStyle({weight: 5, color: "#00ae09", dashArray: "", fillOpacity: 0.7});
        layer.bringToFront();
    }

    function reset(e) {
        places.resetStyle(e.target);
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
