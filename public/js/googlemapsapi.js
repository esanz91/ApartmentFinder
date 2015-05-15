var map;
var markerList;
var infoWindow;
var bounds;

function init() {
    var element = document.getElementById("postalAddress");

    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    var postalAddress = element.value;
    var urlParam = encodeURIComponent(postalAddress);
    var url = "/findApartments?" + element.id + "=" + urlParam;
    request.onreadystatechange = function () {
        //Todo: handle error or null
        setMarkerLocations();
    };
    request.open("GET", url, true);
    request.send(null);
}

function setMarkerLocations() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.msg == "error") {
                alert(error);
                return error;
            }
            if (response.msg == "no matches") {
                alert("no matches");
                // Remove previous markers from map
                setAllMap(null);
                return null;
            }
            if (response.msg == "match") {
                console.log("# search results: " + response.locations.length);

                // Remove previous markers from map and bounds
                setAllMap(null);
                bounds = new google.maps.LatLngBounds();

                // Create list of new markers
                for (var i = 0; i < response.locations.length; i++) {
                    addMarker(response.locations[i]);
                }

                // Add new markers to map
                setAllMap(map);

                // Re-center map to new location
                if(markerList.length > 1) {
                    //var center = bounds.getCenter();
                    map.fitBounds(bounds);
                }
                else{
                    map.setCenter(new google.maps.LatLng(response.focus.lat, response.focus.lng));
                }
            }
        }
    }
}

// Set markers on map
function setAllMap(map) {
    for (var i = 0; i < markerList.length; i++) {
        markerList[i].setMap(map);
    }
    if (null === map) {
        markerList.length = 0;
        markerList = [];
    }
}

// Add marker to map
function addMarker(markerLocation) {

    var textInfo;
    var iwContent;
    var numBed = markerLocation.aptDetails.bedrooms;
    var numBath = markerLocation.aptDetails.bathrooms;
    var pt = new google.maps.LatLng(markerLocation.address.latitude, markerLocation.address.longitude);
    bounds.extend(pt);

    // add marker
    var marker = new google.maps.Marker({
        position: pt,
        map: map
    });
    markerList.push(marker);

    // define info window
    //studio
    if (numBed == 0) {
        textInfo = '<h4 class="text-info">$' + markerLocation.aptDetails.rent + ' <small>| Studio</small></h4>';
    }
    // apts
    else {
        textInfo = '<h4 class="text-info">$' + markerLocation.aptDetails.rent + ' <small>| ' + numBed + 'bd/' + numBath + 'ba</small></h4>';
    }

    iwContent = '<div>' +
        '<div>' +
        textInfo +
        '<div>' +
        '' +
        '</div>' +
        '<address class="text-info">' + markerLocation.address.street_number + ' ' + markerLocation.address.route + '</address>';
    '</div>';

    // add window info
    google.maps.event.addListener(marker, 'click', function () {
        displayApartmentInfo(markerLocation);
        infoWindow.setContent(iwContent);
        infoWindow.open(map, marker);
    });
}

function displayApartmentInfo(markerLocation){
    var searchContent = document.getElementById("search-content");
    var mapCanvas = document.getElementById("map-canvas");
    var contentCssToAdd = "content-display-inline-block right-sidebar content-padding content-padding-top";
    var contentCssToRemove = "content-display-none";
    var mapCssToAdd = "content-65-width";
    var mapCssToRemove = "content-full-width";
    toggleClass(searchContent, contentCssToAdd, contentCssToRemove, true);
    toggleClass(mapCanvas, mapCssToAdd, mapCssToRemove, true);
    floatLeft(mapCanvas);
    showMsg(true, markerLocation.address.street_number + ' ' + markerLocation.address.route);
}

function createMap() {
    var map;

    //info window
    infoWindow = new google.maps.InfoWindow();

    // list to hold all markers of map
    markerList = new Array();

    // map style
    var styles = [
        {
            stylers: [
                {hue: "#104BA9"/*"#37766B"*/},
                {saturation: -50}
            ]
        }, {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [
                {lightness: 100},
                {visibility: "simplified"}
            ]
        }, {
            featureType: "road",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        }
    ];

    // map options
    var mapOptions = {
        center: new google.maps.LatLng(40.767091, -73.975810),
        zoom: 8
        //styles: styles
    }

    // run only if map div found
    if (document.getElementById("map-canvas")) {
        showMap(mapOptions);

        // run only if search button found
        if (document.getElementById("search-button")) {
            document.getElementById("search-button").onclick = function () {
                init();
            }
        }
    }

}

function showMap(mapOptions) {
    // create a new map inside of the given HTML container with the given map option, if any
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // geolocation API centers around a new property on the global navigator object: navigator.geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            map.setZoom(14);
        });
    }
}

function getLatLong(address) {
    var geo = new google.maps.Geocoder;

    geo.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            return results[0].geometry.location;
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}