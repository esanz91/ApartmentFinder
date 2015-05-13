function init(map) {
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
        setMarkerLocations(map, addMarker);
    };
    request.open("GET", url, true);
    request.send(null);
}

function setMarkerLocations(map) {
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.msg == "error") {
                alert(error);
                return error;
            }
            if (response.msg == "no matches") {
                alert("no matches");
                return null;
            }
            if (response.msg == "match") {
                alert("matches: " + response.markerList.length);
                addMarker(map, response.markerList);
            }
        }
    }
}

function addMarker(map, markerList) {
    var lat;
    var lng;
    var locations = [];

    for (var i = 0; i < markerList.length; i++) {
        lat = markerList[i].address.latitude;
        lng = markerList[i].address.longitude;

        locations[i] = new google.maps.LatLng(lat,lng);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            visible: true
        });
    }
    return;
}

function createMap() {
    var map;

    // map options
    var mapOptions = {
        center: new google.maps.LatLng(40.767091, -73.975810),
        zoom: 8
    }

    //run only if map div found
    if (document.getElementById("map-canvas")) {
        map = showMap(mapOptions);

        //run only if search button found
        if (document.getElementById("search-button")) {
            document.getElementById("search-button").onclick = function () {
                init(map);
            }
        }
    }

}

function showMap(mapOptions) {
    //creates a new map inside of the given HTML container with the given map option, if any
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //geolocation API centers around a new property on the global navigator object: navigator.geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            map.setZoom(14);
        });
    }
    return map;
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