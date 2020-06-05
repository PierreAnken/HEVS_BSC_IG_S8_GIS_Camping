// **** Define the overlays ****
//to do : reformat map.js
let map;
let placeslayer = L.layerGroup();
let buildingslayer = L.layerGroup();
let poolslayer = L.layerGroup();
let treeslayer = L.layerGroup();

let poolfilterlayer = L.layerGroup();
let treesfilterlayer = L.layerGroup();
let overlays = {
    "Places": placeslayer,
    "Buildings": buildingslayer,
    "Pools": poolslayer,
    "Trees": treeslayer
};
var filterCheck = {"treeFilterOn": false}

// Styles for places marked as near pool/trees
let stylePool = () => {
    return {fillColor: '#4caec4', fillOpacity: 0.7, stroke: false};
}
let styleTrees = () => {
    return {color: '#57a54a', weight: 4, fill: true};
}

function initialize() {

    // **** Define the base tile layer ****
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var bases = {
        "Map": OpenStreetMap_Mapnik,
    };


    // **** Create the leaflet map ****
    map = L.map('campingmap', {minZoom: 10, maxZoom: 18}).setView([46.211606, 7.3167], 18);

    var placesfile = '/places.json/';
    $.getJSON(placesfile, function (data) {
        places = L.geoJson(data, {onEachFeature: onEachPlace});
        places.addTo(placeslayer);
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
        trees = L.geoJson(data, {onEachFeature: onEachFeature});
        trees.addTo(treeslayer);
    });


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
        var latlng = {"lat": coordinates[1], "lng": coordinates[0]}
        var popup = L.popup();

        popup.setLatLng(latlng)
            .setContent(`<button class="btn btn-success" onclick="window.location.href='/reserve';">Reserve slot ${slotId}</button>`)
            .openOn(map);
    }


    // **** Assemble layers ****
    placeslayer.addTo(map);
    buildingslayer.addTo(map);
    poolslayer.addTo(map);
    treeslayer.addTo(map);
    OpenStreetMap_Mapnik.addTo(map);
    L.control.layers(bases, overlays).addTo(map);


    map.on("click", displayLocation);

}

//To do : finish reserve feature
function reserve(slot) {
    var userId = document.getElementById('user-id');
    alert(`Todo: Reserving slot ${slot} for ${userId.dataset.userName}(${userId.dataset.userId})`);
}

function filterPool(poolMaxRange) {
    let poolsfilter = '/poolsfilter.json/'+poolMaxRange+'/';
    console.log(poolsfilter)
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
        if (feature.properties) {
            layer.bindPopup(feature.properties.pk);
        }
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
    let treeCheckbox = form.elements["trees-filter"].checked;
    removePoolFilter()
    filterPool(poolMaxRange);
    if (treeCheckbox === true && filterCheck.treeFilterOn === false) {
        filterTrees()
    } else if (treeCheckbox === false) {
        removeTreeFilter();
    }
}


// **** Universal highlight ****
function highlight(e) {
    console.log(e.target);
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