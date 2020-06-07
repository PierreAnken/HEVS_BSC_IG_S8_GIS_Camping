// **** Define the overlays ****
//to do : reformat map.js
let map;
let placeslayer = L.layerGroup();
let buildingslayer = L.layerGroup();
let poolslayer = L.layerGroup();
let treeslayer = L.layerGroup();

let placesmatchingfilterlayer = L.layerGroup();

let overlays = {
    "Places": placeslayer,
    "Buildings": buildingslayer,
    "Pools": poolslayer,
    "Trees": treeslayer
};

// Styles for places marked as near pool/trees
let styleMatchFilterPlaces = () => {
    return {fillColor: 'green', fillOpacity: 0.7, stroke: false};
}

let styleReserved = () => {
    return {fillColor: '#fcd32f', fillOpacity: 0.8, stroke: true};
}
let styleBooked = () => {
    return {fillColor: '#fc3d2f', fillOpacity: 0.8, stroke: true};
}
let styleUserBooking = () => {
    return {fill:false, stroke: false};
}


let greenIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/616/616541.svg',

    iconSize: [45, 110], // size of the icon
    shadowSize: [30, 50], // size of the shadow
    iconAnchor: [23, 75], // point of the icon which will correspond to marker's location
    shadowAnchor: [-6, 70],  // the same for the shadow
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

let humanIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/2921/2921147.svg',

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

    var bases = {
        "Map": OpenStreetMap_Mapnik
    };


    // **** Create the leaflet map ****
    map = L.map('campingmap', {minZoom: 10, maxZoom: 19}).setView([46.211606, 7.3167], 18);

    var placesfile = '/places.json/';
    $.getJSON(placesfile, function (data) {
        places = L.geoJson(data, {onEachFeature: onEachPlace});
        places.addTo(placeslayer);
    });
    var reservedfile = '/reservedplaces.json/';
    $.getJSON(reservedfile, function (data) {
        places = L.geoJson(data, {style: styleReserved});
        places.addTo(placeslayer);
    });
    var bookedfile = '/bookedplaces.json/';
    $.getJSON(bookedfile, function (data) {
        booked_places = L.geoJson(data, {onEachFeature: onEachBookedPlace, style: styleBooked});
        booked_places.addTo(placeslayer);
    });
    var userbookingsfile = '/userbookings.json/';
    $.getJSON(userbookingsfile, function (data) {
        user_bookings_places = L.geoJson(data, {onEachFeature: onEachUserBookings, style: styleUserBooking});
        user_bookings_places.addTo(placeslayer);
    });

    var buildingsfile = '/buildings.json/';
    $.getJSON(buildingsfile, function (data) {
        buildings = L.geoJson(data, {onEachFeature: onEachFeature});
        buildings.addTo(buildingslayer);
    });

    var poolsfile = '/pools.json/';
    $.getJSON(poolsfile, function (data) {
        pools = L.geoJson(data, {onEachFeature: onEachFeature});
        pools.addTo(poolslayer);
    });

    var treesfile = '/trees.json/';
    $.getJSON(treesfile, function (data) {
        trees = L.geoJson(data, {onEachFeature: onEachFeature, pointToLayer: pointToLayer});
        trees.addTo(treeslayer);
    });

    function pointToLayer(feature, latlng) {
        L.marker(latlng, {icon: greenIcon}).addTo(map);
    }

    // **** Decorate feature ****
    function onEachFeature(feature, layer) {
        // if (feature.properties) {
        //     layer.bindPopup(feature.properties.pk);
        // }
        layer.on({
            mouseover: highlight,
            mouseout: reset,
            click: zoom
        });
    }

    function onEachUserBookings(feature, layer) {
        L.marker((layer.getBounds().getCenter()), {icon: humanIcon}).addTo(map);
    }

    function onEachBookedPlace(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
        layer.on({
            mouseover: highlight,
            mouseout: resetBooked,
            click: zoom
        });
        layer.on("click", function () {
            var popup = L.popup();
            popup.setLatLng(layer.getBounds().getCenter())
                .setContent(`<button class="btn btn-danger">Slot ${feature.properties.pk} booked</button>`)
                .openOn(map);
        });
    }

    function resetBooked(e) {
        booked_places.resetStyle(e.target);
        booked_places.setStyle(styleBooked);
    }

    function onEachPlace(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
        layer.on({
            mouseover: highlight,
            mouseout: reset,
            click: zoom
        });
        //display popup to book slot
        layer.on("click", function () {
            var popup = L.popup();
            popup.setLatLng(layer.getBounds().getCenter())
                .setContent(`<button class="btn btn-success" onclick="window.location.href='reserve/${feature.properties.pk}'" >Reserve slot ${feature.properties.pk}</button>`)
                .openOn(map);
        });
    }

    function reset(e) {
        places.resetStyle(e.target);
        buildings.resetStyle(e.target);
        pools.resetStyle(e.target);
        trees.resetStyle(e.target);
    }


    // **** Add popup with the location ****
    function displayLocation(e) {
        var popup = L.popup();
        popup.setLatLng(e.latlng)
            .setContent("The current location is: " + e.latlng.toString())
            .openOn(map);
    }


    // **** Assemble layers ****
    placeslayer.addTo(map);
    buildingslayer.addTo(map);
    poolslayer.addTo(map);
    treeslayer.addTo(map);
    OpenStreetMap_Mapnik.addTo(map);
    L.control.layers(bases, overlays).addTo(map);


    // map.on("click", displayLocation);

}

async function applyFilters() {

    console.log("applying filters")

    //remove filter layer
    placesmatchingfilterlayer.removeFrom(map);
    placesmatchingfilterlayer = L.layerGroup();

    //get form data
    let form = document.getElementById("filter-form");
    let poolMaxRange = form.elements["pool-max-range"].value;
    let maxNeighbour = form.elements["max-neighbour"].value;
    let withTree = form.elements["trees-filter"].checked;
    let petMinRange = form.elements["pets-min-range"].value;
    let childrenMinRange = form.elements["children-min-range"].value;

    //get filtered places
    let filtered_places_url = '/applyfilters.json/' + poolMaxRange + '/'+ maxNeighbour + '/'+ withTree + '/'+ petMinRange + '/'+ childrenMinRange + '/';
    let filtered_places

    $.getJSON(filtered_places_url, function (data) {
        filtered_places = L.geoJson(data,
            {
                onEachFeature: onEachPlaceMatchingFilter,
                style: styleMatchFilterPlaces()
            });
        filtered_places.addTo(placesmatchingfilterlayer);
        placesmatchingfilterlayer.addTo(map)
    });

    function onEachPlaceMatchingFilter(feature, layer) {
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
        layer.on({
            mouseover: highlight,
            mouseout: resetPlaceMatchingFilter,
            click: zoom
        });
    }

    function resetPlaceMatchingFilter(e) {
        if(typeof filtered_places !== 'undefined'){
            filtered_places.resetStyle(e.target);
            filtered_places.setStyle(styleMatchFilterPlaces);
        }
    }
}

// **** Universal highlight ****
function highlight(e) {
    let layer = e.target;
    if (e.target.feature.geometry.type === "Point") return;
    layer.setStyle({
        weight: 5,
        color: "#66ff66",
        backgroundColor: "#66ff66",
        dashArray: "",
        fillOpacity: 0.7,
        stroke: true
    });
    layer.bringToFront();
}

// **** Universal zoom ****
function zoom(e) {
    map.fitBounds(e.target.getBounds());
}