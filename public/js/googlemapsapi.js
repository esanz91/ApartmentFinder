function createMap() {
    var map;

    //creates a new instance of a Geocoder that sends geocode requests to Google servers
    geocoder = new google.maps.Geocoder();

    //creates a LatLng object representing a geographic point
    var latlng = new google.maps.LatLng(40.767091, -73.975810);

    var mapOptions = {
        center: latlng,
        zoom: 8
    }

    //run only if map div found
    if(document.getElementById("map-canvas")) {
        map = showMap(mapOptions);
    }

    //run only if search button found
    if(document.getElementById("search-button")) {
        document.getElementById("search-button").onclick = function () {
            codeAddress(map);
        }
    }
}

function codeAddress(map) {
    var address = document.getElementById("address").value;
    geocoder.geocode({ 'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            var latlng = new google.maps.LatLng(latitude, longitude);
            map.setCenter(latlng);

            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
        else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function showMap(mapOptions){
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

//google.maps.event.addDomListener(window, 'load', initialize);
