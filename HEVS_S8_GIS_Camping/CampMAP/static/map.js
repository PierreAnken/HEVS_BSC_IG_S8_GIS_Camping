// **** Define the overlays ****
//to do : reformat map.js
let map;
let placeslayer = L.layerGroup();
let buildingslayer = L.layerGroup();
let poolslayer = L.layerGroup();
let treeslayer = L.layerGroup();
let poolfilterlayer = L.layerGroup();
let treesfilterlayer = L.layerGroup();
let neighbourfilterlayer = L.layerGroup();


let overlays = {
    "Places": placeslayer,
    "Buildings": buildingslayer,
    "Pools": poolslayer,
    "Trees": treeslayer
};
var filterCheck = {"treeFilterOn": false}

// Styles for places marked as near pool/trees
let styleFreePlaces = () => {
    return {fillColor: 'green', fillOpacity: 0.7, stroke: false};
}

let stylePool = () => {
    return {fillColor: '#4caec4', fillOpacity: 0.7, stroke: false};
}
let styleReserved = () => {
    return {fillColor: '#fcd32f', fillOpacity: 0.8, stroke: false};
}
let styleBooked = () => {
    return {fillColor: '#fc3d2f', fillOpacity: 0.8, stroke: true};
}
let styleTrees = () => {
    return {color: '#57a54a', weight: 4, fill: false};
}

let styleNeighbour = () => {
    return {fillColor: '#000000'};
}
  var greenIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/616/616541.svg',


    iconSize:     [45, 110], // size of the icon
    shadowSize:   [30, 50], // size of the shadow
    iconAnchor:   [23, 75], // point of the icon which will correspond to marker's location
    shadowAnchor: [-6, 70],  // the same for the shadow
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
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
        trees = L.geoJson(data, {onEachFeature: onEachFeature, pointToLayer:pointToLayer});
        trees.addTo(treeslayer);
    });

    function pointToLayer (feature, latlng) {
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
            var latlng = {
                "lat": feature.geometry.coordinates[0][0][0][1],
                "lng": feature.geometry.coordinates[0][0][0][0]
            }
            var popup = L.popup();
            popup.setLatLng(latlng)
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
            displayPopup(feature.geometry.coordinates[0][0][0], feature.properties.pk);
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

    function displayPopup(coordinates, slotId) {
        //change to [0] [1] if popup shows up at wrong continent
        var userId = document.getElementById('user-id').dataset.userId;
        var latlng = {"lat": coordinates[1], "lng": coordinates[0]}
        var popup = L.popup();
        popup.setLatLng(latlng)
            .setContent(`<button class="btn btn-success" onclick="window.location.href='reserve/${slotId}'" >Reserve slot ${slotId}</button>`)
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

//To do : finish reserve feature
function reserve(slot) {
    var userId = document.getElementById('user-id');
    alert(`Todo: Reserving slot ${slot} for ${userId.dataset.userName}(${userId.dataset.userId})`);
}

function filterPool(poolMaxRange) {
    let poolsfilter = '/poolsfilter.json/' + poolMaxRange + '/';
    let pools_filter_places
    $.getJSON(poolsfilter, function (data) {
        pools_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachPoolFilterFeature,
                style: stylePool
            });
        pools_filter_places.addTo(poolfilterlayer);
        poolfilterlayer.addTo(map)
    });

    function onEachPoolFilterFeature(feature, layer) {
        // if (feature.properties) {
        //     layer.bindPopup(feature.properties.pk);
        // }
        layer.on({
            mouseover: highlight,
            mouseout: resetPool,
            click: zoom
        });
    }

    function resetPool(e) {
        pools_filter_places.resetStyle(e.target);
        pools_filter_places.setStyle(stylePool);
    }
}

function removePoolFilter() {
    poolfilterlayer.removeFrom(map);
    poolfilterlayer = L.layerGroup();
}

function filterNeighbours(maxNeighbour) {
    let neighbourfilter = '/neighbourfilter.json/' + maxNeighbour + '/';
    $.getJSON(neighbourfilter, function (data) {
        neighbour_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachNeighbourFilterFeature,
                style: styleNeighbour()
            });
        neighbour_filter_places.addTo(neighbourfilterlayer);
        neighbourfilterlayer.addTo(map);
    });

    function onEachNeighbourFilterFeature(feature, layer) {
        // if (feature.properties) {
        //     layer.bindPopup(feature.properties.pk);
        // }
        layer.on({
            mouseover: highlight,
            mouseout: resetNeighbour,
            click: zoom
        });
    }

    function resetNeighbour(e) {
        neighbour_filter_places.resetStyle(e.target);
        neighbour_filter_places.setStyle(styleNeighbour());
    }
}

function removeNeighbourFilter() {
    neighbourfilterlayer.removeFrom(map);
    neighbourfilterlayer = L.layerGroup();
}

function filterTrees() {
    let treefilter = '/treesfilter.json/';
    $.getJSON(treefilter, function (data) {
        trees_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachTreeFilterFeature,
                style: styleTrees
            });
        trees_filter_places.addTo(treesfilterlayer);
        treesfilterlayer.addTo(map);
        filterCheck.treeFilterOn = true;
    });


    function onEachTreeFilterFeature(feature, layer) {
        // if (feature.properties) {
        //     layer.bindPopup(feature.properties.pk);
        // }
        layer.on({
            mouseover: highlight,
            mouseout: resetTree,
            click: zoom
        });
    }

    function resetTree(e) {
        trees_filter_places.resetStyle(e.target);
        trees_filter_places.setStyle(styleTrees);
    }
}

function removeTreeFilter() {
    treesfilterlayer.removeFrom(map);
    filterCheck.treeFilterOn = false;
    treesfilterlayer = L.layerGroup();
}

async function submitForm() {
    let form = document.getElementById("filter-form");
    let poolMaxRange = form.elements["pool-max-range"].value;
    let maxNeighbour = form.elements["max-neighbour"].value;
    let treeCheckbox = form.elements["trees-filter"].checked;

    removePoolFilter()
    removeNeighbourFilter()

    filterPool(poolMaxRange);
    if (maxNeighbour > 0) {
        filterNeighbours(maxNeighbour);
    }

    if (treeCheckbox === true && filterCheck.treeFilterOn === false) {
        filterTrees()
    } else if (treeCheckbox === false) {
        removeTreeFilter();
    }
}


// **** Universal highlight ****
function highlight(e) {
    var userName = document.getElementById('user-id').dataset.userName;
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