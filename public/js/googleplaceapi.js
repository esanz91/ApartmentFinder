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
    //var urlParam = addressParam;
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + urlParam + "&key=AIzaSyDDtmMF_hb0c03tCHSgeE-JwbJYho45EQY";

    console.log("URL:\n" + url);

    request.onreadystatechange = function () {
        handleResponse(function(inputGeo, placeGeo){

            console.log("inputGeo.A: " + JSON.parse(inputGeo).A);
            console.log("placeGeo.A: " + JSON.parse(placeGeo).A);
            console.log("inputGeo.F: " + JSON.parse(inputGeo).F);
            console.log("placeGeo.F: " + JSON.parse(placeGeo).F);

            if((JSON.parse(inputGeo).A == JSON.parse(placeGeo).A) && (JSON.parse(inputGeo).F == JSON.parse(placeGeo).F)){
                console.log("input and autosearch the SAME!");
            }
            else{
                console.log("input and autosearch NOT the same!");
            }
        });
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

function handleResponse(callback) {
    "use strict";
    if (request.readyState == 4) {
        if (request.status == 200) {
            if (request.responseText) {
                console.log(typeof request.responseText);
                var inputString = JSON.parse(request.responseText).results[0].formatted_address;
                var inputGeo;

                //Todo find out why geocode for my address returns different results
                console.log("INPUT:\n" + inputString);
                getLatLong(inputString, function(data){
                    inputGeo = data;
                    console.log("inputgeo returned: " + data + "\n");
                    var placeString = "";
                    var placeGeo;

                    for (var i = 0; i < place.address_components.length; i++) {
                        placeString = placeString + " " + (place.address_components[i].short_name);
                    }

                    console.log("PLACE: \n" + placeString);
                    getLatLong(placeString, function(data){
                        placeGeo = data;
                        console.log("placegeo returned: " + data);
                        callback(inputGeo, placeGeo);
                    });
                });
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

    google.maps.event.addListener(autocomplete, 'place_changed', function () {

        place = autocomplete.getPlace();
        console.log("listener (place): " + place);
        document.getElementById("postalAddress").value = place.formatted_address;
        //document.getElementById("postalAddress").focus();

    });
}

String.prototype.escapeSpecialChars = function() {
    return this.replace(/\\n/g, "")
        .replace(/\\'/g, "")
        .replace(/\\"/g, "")
        .replace(/\\r/g, "\\r")
        .replace(/\"/g, "");
};