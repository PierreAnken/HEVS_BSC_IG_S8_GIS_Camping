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
    var poolslayer = L.layerGroup();
    var treeslayer = L.layerGroup();

    var overlays = {
        "Places": placeslayer,
        "Buildings": buildingslayer,
        "Pools": poolslayer,
        "Trees": treeslayer
    };


    // **** Create the leaflet map ****
    var map = L.map('campingmap', { minZoom: 10, maxZoom: 18 }).setView([46.211606, 7.3167], 18);

    var placesfile = '/places.json/';
    $.getJSON(placesfile, function (data) {
        places = L.geoJson(data, { onEachFeature: onEachFeature });
        places.addTo(placeslayer);
    });

    var buildingsfile = '/buildings.json/';
    $.getJSON(buildingsfile, function (data) {
        buildings = L.geoJson(data, { onEachFeature: onEachFeature });
        buildings.addTo(buildingslayer);
    });

    var poolsfile = '/pools.json/';
    $.getJSON(poolsfile, function (data) {
        pools = L.geoJson(data, { onEachFeature: onEachFeature });
        pools.addTo(poolslayer);
    });

    var treesfile = '/trees.json/';
    $.getJSON(treesfile, function (data) {
        trees = L.geoJson(data, { onEachFeature: onEachFeature });
        trees.addTo(treeslayer);
    });

    let treesfilter = '/treesfilter.json/';
    $.getJSON(treesfilter, function (data) {
        trees_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachFeature
            });
        //trees_filter_places.addTo(placeslayer);
        console.log(data);
    });

    let poolsfilter = '/poolsfilter.json/';
    $.getJSON(poolsfilter, function (data) {
        pools_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachFeature
            });
        pools_filter_places.addTo(placeslayer);
        console.log(data);
    });


    // **** Assemble layers ****
    placeslayer.addTo(map);
    buildingslayer.addTo(map);
    poolslayer.addTo(map);
    treeslayer.addTo(map);
    OpenStreetMap_Mapnik.addTo(map);
    L.control.layers(bases, overlays).addTo(map);


    // **** Decorate feature ****
    function onEachFeature(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
        layer.on({
            mouseover: highlight,
            mouseout: reset,
            click: zoom
        });
    }


    // **** Define the highlight functions ****
    // TODO: change the colors depending on the state
    function highlight(e) {
        //console.log(e.target);
        let layer = e.target;
        if (e.target.feature.geometry.type === "Point") return;
        layer.setStyle({weight: 5, color: "#66ff66", backgroundColor: "#66ff66", dashArray: "", fillOpacity: 0.7});
        layer.bringToFront();
    }

    function reset(e) {
        buildings.resetStyle(e.target);
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
