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
let petsfilterlayer = L.layerGroup();
let childrenfilterlayer = L.layerGroup();

let overlays = {
    "Places": placeslayer,
    "Buildings": buildingslayer,
    "Pools": poolslayer,
    "Trees": treeslayer
};
var filterCheck = {"treeFilterOn": false, "petFilterOn": false, "childrenFilterOn": false}

// Styles for places marked as near pool/trees
let styleFreePlaces = () => {
    return {fillColor: 'green', fillOpacity: 0.7, stroke: false};
}

let stylePool = () => {
    return {fillColor: '#4caec4', fillOpacity: 0.7, stroke: false};
}
let styleReserved = () => {
    return {fillColor: '#fcd32f', fillOpacity: 0.8, stroke: true};
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
let stylePet = () => {
    return {fillColor: '#570afc', fillOpacity: 0.6, stroke: false};
}
let styleChildren = () => {
    return {color: '#fc00bd', weight: 4, fill: false};
}
let styleUserBooking = () => {
    return {fill:false, stroke: false};
}
var greenIcon = L.icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/616/616541.svg',

    iconSize: [45, 110], // size of the icon
    shadowSize: [30, 50], // size of the shadow
    iconAnchor: [23, 75], // point of the icon which will correspond to marker's location
    shadowAnchor: [-6, 70],  // the same for the shadow
    popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});
var humanIcon = L.icon({
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
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
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

function filterPets() {
    let petfilter = '/petfilter.json/';
    $.getJSON(petfilter, function (data) {
        pets_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachPetFilterFeature,
                style: stylePet
            });
        pets_filter_places.addTo(petsfilterlayer);
        petsfilterlayer.addTo(map);
        filterCheck.petFilterOn = true;
    });


    function onEachPetFilterFeature(feature, layer) {
        // if (feature.properties) {
        //     layer.bindPopup(feature.properties.pk);
        // }
        layer.on({
            mouseover: highlight,
            mouseout: resetPet,
            click: zoom
        });
    }

    function resetPet(e) {
        pets_filter_places.resetStyle(e.target);
        pets_filter_places.setStyle(stylePet);
    }
}

function removePetFilter() {
    petsfilterlayer.removeFrom(map);
    filterCheck.petFilterOn = false;
    petsfilterlayer = L.layerGroup();
}

function filterChildren() {
    let childrenfilter = '/childrenfilter.json/';
    $.getJSON(childrenfilter, function (data) {
        children_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachChildrenFilterFeature,
                style: styleChildren
            });
        children_filter_places.addTo(childrenfilterlayer);
        childrenfilterlayer.addTo(map);
        filterCheck.childrenFilterOn = true;
    });


    function onEachChildrenFilterFeature(feature, layer) {
        // if (feature.properties) {
        //     layer.bindPopup(feature.properties.pk);
        // }
        layer.on({
            mouseover: highlight,
            mouseout: resetChildren,
            click: zoom
        });
    }

    function resetChildren(e) {
        children_filter_places.resetStyle(e.target);
        children_filter_places.setStyle(styleChildren);
    }
}

function removeChildrenFilter() {
    childrenfilterlayer.removeFrom(map);
    filterCheck.childrenFilterOn = false;
    childrenfilterlayer = L.layerGroup();
}


async function submitForm() {
    let form = document.getElementById("filter-form");
    let poolMaxRange = form.elements["pool-max-range"].value;
    let maxNeighbour = form.elements["max-neighbour"].value;
    let treeCheckbox = form.elements["trees-filter"].checked;
    let petCheckbox = form.elements["pets-filter"].checked;
    let childrenCheckbox = form.elements["children-filter"].checked;

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
    if (petCheckbox === true && filterCheck.petFilterOn === false) {
        filterPets()
    } else if (petCheckbox === false) {
        removePetFilter()
    }
    if (childrenCheckbox === true && filterCheck.childrenFilterOn === false) {
        filterChildren()
    } else if (childrenCheckbox === false) {
        removeChildrenFilter()
    }
    // if (childrenCheckbox === true) {
    //     alert('children')
    // } else if (childrenCheckbox === false) {
    //     alert('children no')
    // }
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