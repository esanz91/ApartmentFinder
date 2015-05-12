
window.onload = init();

function init(){
    document.getElementById("search-button").onclick = function(){
        alert(document.getElementById("search-button"));

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
            displayMarkersOnMap();
        };
        request.open("GET", url, true);
        request.send(null);
    };
}

function displayMarkersOnMap(){
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            alert(response);
            /*
            if (response == "error") {
                alert(error);

                //setFieldStatus(elementID, true);
                //setSpanMsg(elementID, true, "");

                return;
            }
            if (response){

            */
        }
    }
}



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
    /*
    alert("1. " + document.getElementById("-button"));
    if(document.getElementById("search-button")) {
        alert("2. " + document.getElementById("search-button"));
        document.getElementsByName("search-button").onclick = function () {
            alert("3. " + document.getElementsByName("search-button"));
            codeLocation(map);
        }
    }*/

}

function codeLocation(map) {
    var location = document.getElementById("location").value;
    geocoder.geocode({ 'address': location}, function (results, status) {
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

function getLatLong(address){
    var geo = new google.maps.Geocoder;

    geo.geocode({'address':address},function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
            return results[0].geometry.location;
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

//google.maps.event.addDomListener(window, 'load', initialize);
