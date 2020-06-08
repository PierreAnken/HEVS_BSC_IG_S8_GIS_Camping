function initialize() {

    // **** Define the base tile layer ****
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // **** Define the overlay ****
    var camping_areaslayer = L.layerGroup();
    var buildings_layer = L.layerGroup();
    var pools_layer = L.layerGroup();

    // **** Create the leaflet map ****
    var map = L.map('campingmap', { minZoom: 10, maxZoom: 20 }).setView([46.211606, 7.3167], 18);

    var campingareasfile = '/campingareas.json/';
    $.getJSON(campingareasfile, function (data) {
        campingareas = L.geoJson(data, { onEachFeature: onEachFeature });
        campingareas.addTo(camping_areaslayer);
    });
    var buildingsfile = '/buildings.json/';
    $.getJSON(buildingsfile, function (data) {
        buildings = L.geoJson(data, { onEachFeature: onEachFeature });
        buildings.addTo(buildings_layer);
    });

    var poolsfile = '/pools.json/';
    $.getJSON(poolsfile, function (data) {
        pools = L.geoJson(data, { onEachFeature: onEachFeature });
        pools.addTo(pools_layer);
    });
    // **** Assemble layers ****
    OpenStreetMap_Mapnik.addTo(map);
    camping_areaslayer.addTo(map);
    buildings_layer.addTo(map);
    pools_layer.addTo(map);
    // **** Decorate feature ****
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlight,
            mouseout: reset,
            click: alertUser
        });
    }


    // **** Define the highlight functions ****
    function highlight(e) {
        console.log(e.target);
        var layer = e.target;
        layer.setStyle({ weight: 5, color: "#ffeb01", backgroundColor: "#ffeb01", dashArray: "", fillOpacity: 0.7 });
    }

    function reset(e) {
        campingareas.resetStyle(e.target);
    }


    // **** Alert anonymous user with popup ****
    var popup = L.popup();

    function alertUser(e) {
        popup.setLatLng(e.latlng)
            .setContent('<div class="modal-body">' +
                '<text class="popup-index-title">You are not authorized to access</text><br/><br/>' +
                '<text class="popup-index-text">Please login with authenticated account to perform some action.<br/>' +
                'Or register your account by clicking the button below.</text>' +
                '<button type="button" onclick="window.location.href=\'/signup\'" class="btn-sm btn-popup-index">Register &gt;</button>' +
                '</div>')
            .openOn(map);
    }
}
