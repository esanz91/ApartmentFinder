var place;

window.onload = init();

function init() {
    document.getElementById("postalAddress").onblur = validateAddress;
}

function validateAddress() {

    var inputAddress = this;

    if (inputAddress.value.length < 1) {
        console.log("empty");
        return;
    }

    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    var addressParam = inputAddress.value;
    var urlParam = encodeURIComponent(addressParam);
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + urlParam + "&key=AIzaSyDDtmMF_hb0c03tCHSgeE-JwbJYho45EQY";

    request.onreadystatechange = function () {
        handleResponse();
    };
    request.open("GET", url, true);
    request.send(null);

    /*
     var geoInput = getLatLong(element.value);
     //var geoPlace = getLatLong(place);
     console.log("geoInput: " + geoInput);
     //console.log(geoPlace);
     //if(results[0].)
     */
}

function handleResponse() {
    "use strict";
    if (request.readyState == 4) {
        if (request.status == 200) {
            if (request.responseText) {
                console.log(typeof request.responseText);
                var inputString = JSON.stringify(request.responseText);
                var inputEscaped = inputString.escapeSpecialChars();
                var placeString = "";

                console.log("RESPONSE \n" + inputEscaped);

                //var inputGeo = getLatLong();

                console.log("\n");
                console.log("PLACE \n");
                for (var i = 0; i < place.address_components.length; i++) {
                    placeString = placeString + " " + (place.address_components[i].short_name);
                }
                console.log(placeString);
                var placeGeo = getLatLong(placeString, function(data){
                    console.log("geo returned: " + data);
                });
                return;
            }
        }
    }
}

function autocompleteSearchBox() {
    var inputAddress = document.getElementById("postalAddress");
    var US = {country: 'us'};
    var options = {
        types: ['address'],
        componentRestrictions: US
    };
    var autocomplete = new google.maps.places.Autocomplete(inputAddress, options);

    place = autocomplete.getPlace();
    console.log("listener (place): " + place);

    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        place = autocomplete.getPlace();
        document.getElementById("postalAddress").focus();
        //var geoPlace = getLatLong(place);
        /*
         if((geoInput.latitude == geoPlace.latitude) && (geoInput.longitude == geoInput.latitude)){
         console.log("SAME!");
         }
         else{
         console.log("not the same");
         }*/
    });
}

String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "")
        .replace(/\\'/g, "")
        .replace(/\\"/g, "")
        .replace(/\\r/g, "\\r")
        .replace(/\"/g, "");
        /*
        .replace(/\\&/g, "\\&")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f")
        */
};