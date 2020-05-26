// **** Define the overlays ****
var map;
var placeslayer = L.layerGroup();
var buildingslayer = L.layerGroup();
var poolslayer = L.layerGroup();
var treeslayer = L.layerGroup();

var poolfilterlayer = L.layerGroup();
var treesfilterlayer = L.layerGroup();
var overlays = {
    "Places": placeslayer,
    "Buildings": buildingslayer,
    "Pools": poolslayer,
    "Trees": treeslayer
};
var filterCheck = {"poolfilter":false, "treefilter":false}
// Styles for places marked as near pool/trees
var stylePool = () => {
    return {fillColor: '#00b88a', fillOpacity: 0.8};
    //cyan fill
}
var styleTrees = () => {
    return {color: '#db8000', weight: 4, fill:false};
    //orange outline
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
        places = L.geoJson(data, {onEachFeature: onEachFeature});
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


    map.on("click", displayLocation);

}

function filterPool() {
    let poolsfilter = '/poolsfilter.json/';
    $.getJSON(poolsfilter, function (data) {
        pools_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachPoolFilterFeature,
                style: stylePool
            });
        pools_filter_places.addTo(poolfilterlayer);
        poolfilterlayer.addTo(map)
        filterCheck.poolfilter = true;
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
    filterCheck.poolfilter = false;
    poolfilterlayer = L.layerGroup();
}

function filterTrees() {
      let treesfilter = '/treesfilter.json/';
    $.getJSON(treesfilter, function (data) {
        trees_filter_places = L.geoJson(data,
            {
                onEachFeature: onEachTreeFilterFeature,
                style: styleTrees
            });
        trees_filter_places.addTo(treesfilterlayer);
        treesfilterlayer.addTo(map);
        filterCheck.treefilter = true;
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
    treesfilterlayer = L.layerGroup();
    filterCheck.treefilter = false;
}

function submitForm() {
    var form = document.getElementById("filter-form");
    var poolCheckbox = form.elements["pool-filter"].checked;
    var treeCheckbox = form.elements["trees-filter"].checked;
    if (poolCheckbox === true && filterCheck.poolfilter === false) {
        filterPool();
    } else if (poolCheckbox === false) {
        removePoolFilter();
    }
    if (treeCheckbox === true && filterCheck.treefilter === false) {
        filterTrees();
    } else if (treeCheckbox === false) {
        removeTreeFilter();
    }
}


// **** Universal highlight ****
function highlight(e) {
    //console.log(e.target);
    let layer = e.target;
    if (e.target.feature.geometry.type === "Point") return;
    layer.setStyle({weight: 5, color: "#66ff66", backgroundColor: "#66ff66", dashArray: "", fillOpacity: 0.7});
    layer.bringToFront();
}

// **** Universal zoom ****
function zoom(e) {
    map.fitBounds(e.target.getBounds());
}