let poolIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/2972/2972208.svg',

    iconSize: [23, 55], // size of the icon
    shadowSize: [30, 50], // size of the shadow
    iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [-6, 70],  // the same for the shadow
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});
let buildingIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/869/869636.svg',

    iconSize: [23, 55], // size of the icon
    shadowSize: [30, 50], // size of the shadow
    iconAnchor: [12, 35], // point of the icon which will correspond to marker's location
    shadowAnchor: [-6, 70],  // the same for the shadow
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

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
    var map = L.map('campingmap', {minZoom: 10, maxZoom: 20}).setView([46.211606, 7.3167], 18);

    var campingareasfile = '/campingareas.json/';
    $.getJSON(campingareasfile, function (data) {
        campingareas = L.geoJson(data, {onEachFeature: decorateEachFeature("campingarea")});
        campingareas.addTo(camping_areaslayer);
    });
    var buildingsfile = '/buildings.json/';
    $.getJSON(buildingsfile, function (data) {
        buildings = L.geoJson(data, {onEachFeature: decorateEachFeature('building')});
        buildings.addTo(buildings_layer);
    });

    var poolsfile = '/pools.json/';
    $.getJSON(poolsfile, function (data) {
        pools = L.geoJson(data, {onEachFeature: decorateEachFeature('pool')});
        pools.addTo(pools_layer);
    });
    // **** Assemble layers ****
    OpenStreetMap_Mapnik.addTo(map);
    camping_areaslayer.addTo(map);
    buildings_layer.addTo(map);
    pools_layer.addTo(map);

    // **** Decorate feature ****
    function decorateEachFeature(featureType) {
        switch (featureType) {
            case "campingarea":
                return function onEachPool(feature, layer) {
                    layer.on({
                        mouseover: highlight,
                        mouseout: reset,
                        click: alertUser
                    });
                }
            case "pool":
                return function onEachPool(feature, layer) {
                    layer.on({
                        mouseover: highlight,
                        mouseout: reset,
                        click: alertUser
                    });
                    L.marker(layer.getBounds().getCenter(), {icon: poolIcon}).addTo(pools_layer);
                }
            case "building":
                return function onEachBuilding(feature, layer) {
                    layer.on({
                        mouseover: highlight,
                        mouseout: reset,
                        click: alertUser
                    });
                    L.marker(layer.getBounds().getCenter(), {icon: buildingIcon}).addTo(buildings_layer);
                }
        }
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlight,
            mouseout: reset,
            click: alertUser
        });
    }


    // **** Define the highlight functions ****
    function highlight(e) {
        var layer = e.target;
        layer.setStyle({weight: 5, color: "#ffeb01", backgroundColor: "#ffeb01", dashArray: "", fillOpacity: 0.7});
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
