var map;
var markerList;
var infoWindow;
var bounds;
var username;

function requestMarkers() {
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
    var url = "/getMarkers?" + element.id + "=" + urlParam;
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
                if (markerList.length > 1) {
                    //var center = bounds.getCenter();
                    map.fitBounds(bounds);
                }
                else {
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

//ToDo: Fix this up. Add mongodb id to "listing-id" element for identification purposes
function displayApartmentInfo(markerLocation) {

    var id = markerLocation._id;
    var searchContent = document.getElementById("search-content");
    var mapCanvas = document.getElementById("map-canvas");

    var resultMsg = document.getElementById("result-msg");
    var resultState = document.getElementById("result-state");
    var resultCity = document.getElementById("result-city");
    var resultAddress = document.getElementById("listing-address");
    var resultRent = document.getElementById("listing-rent");
    var listingDetail = document.getElementById("listing-detail");
    var listingNav = document.getElementById("listing-nav");
    var listingId = document.getElementById("listing-id");

    requestUserFavorites();

    var navCssToAdd = "navbar-inverse content-display-inline-block content-35-width";
    var contentCssToAdd = "content-display-inline-block right-sidebar content-35-width content-padding content-padding-top";
    var contentCssToRemove = "content-display-none";
    var mapCssToAdd = "content-65-width";
    var mapCssToRemove = "content-full-width";

    toggleClass(listingNav, navCssToAdd, contentCssToRemove, true);
    toggleClass(searchContent, contentCssToAdd, contentCssToRemove, true);
    toggleClass(mapCanvas, mapCssToAdd, mapCssToRemove, true);
    floatLeft(mapCanvas);

    showMsg(listingId, true, id);
    showMsg(resultState, true, markerLocation.address.administrative_area_level_1);
    showMsg(resultCity, true, markerLocation.address.locality);
    showMsg(resultAddress, true, markerLocation.address.formatted_address);
    showMsg(resultRent, true, "$" + markerLocation.aptDetails.rent);
    showMsg(resultMsg, true, "apartment info");
    showMsg(listingDetail, true, markerLocation.aptDetails.bedrooms + " bed/" + markerLocation.aptDetails.bathrooms + " bath");
}

function requestUserFavorites() {

    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    var url = "/user/favorites";
    request.onreadystatechange = function () {
        queryFavorites();
    };
    request.open("GET", url, true);
    request.send(null);
}

function queryFavorites() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.msg == "error") {
                console.log('error');
            }
            if (response.msg == "not matches") {
                console.log("favArray: " + null);
            }
            if (response.msg == "match") {
                var isFavorited = false;
                var listingID = document.getElementById("listing-id").textContent;
                console.log("favArray: " + response.favorites);
                console.log(listingID);
                for (var i = 0; i < response.favorites.length; i++) {
                    if (response.favorites[i] == listingID) {
                        isFavorited = true;
                        console.log("match");
                    }
                }
                setFavoriteLink(isFavorited);
            }
        }
    }
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
            document.getElementById("search-button").onclick = requestMarkers;
        }

        if (document.getElementById("favoriteListingLink")) {
            document.getElementById("favoriteListingLink").onclick = toggleFavorite;
        }
    }
}

function requestUsername() {
    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    request.onreadystatechange = function () {
        getUsername(requestUserFavorites);
    };
    var url = "/user";
    request.open("GET", url, true);
    request.send(null);
}

function getUsername(callback) {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.msg == "not found") {
                console.log("getUsername: " + response.username);
                username = null;
            }
            if (response.msg == "found") {
                username = response.username;
                console.log("getUsername: " + username);
                callback(response.username);
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


function getLatLong(address, callback) {

    var geo = new google.maps.Geocoder;

    geo.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log("geo: " + JSON.stringify(results[0].geometry.location));
            callback(JSON.stringify(results[0].geometry.location));
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

