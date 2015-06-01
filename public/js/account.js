window.onload = init();

function init(){
    document.getElementById("userFavorites").onclick = setRequest;
}

function setRequest(){
    requestFavorites("GET");
}

function requestFavorites(action){
    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // set url
    var baseUrl = "/user/favorites/";
    if (document.getElementById("listing-id")) {
        var listingID = document.getElementById("listing-id").textContent;
        var url = baseUrl + listingID;
    }

    // set callback
    request.onreadystatechange = function () {
        getFavorites();
    };

    // init and send request
    if (action == "DELETE") {
        console.log("delete requested");
        request.open("DELETE", url, true);
        request.send(null);
    }
    else if (action == "PUT") {
        console.log("put requested");
        request.open("PUT", url, true);
        request.send(null);
    }
    else if (action == "GET") {
        console.log("get requested");
        request.open("GET", baseUrl, true);
        request.send(null);
    }
}

function getFavorites(){
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.msg == "error") {
                console.log("error");
            }
            if (response.msg == "match") {
                console.log("found");
                //Todo: make another ajax call to query listings
                displayFavorites(response);
            }
            if (response.msg == "no matches") {
                console.log("not found");
            }
            if (response.msg == "not deleted") {
                console.log("not deleted");
            }
            if (response.msg == "deleted") {
                console.log("deleted");
            }
            if (response.msg == "not updated") {
                console.log("not updated");
            }
            if (response.msg == "updated") {
                console.log("updated");
            }
        }
    }
}

function displayFavorites(response){
    var favoriteListingsDiv = document.getElementById("favoriteListingsDiv");
    for (var i = 0; i < response.favorites.length; i++) {

        var newPara = document.createElement("p");

        var listing = document.createTextNode(response.favorites[i]);
        console.log(listing);

        newPara.innerHTML = listing.textContent;
        favoriteListingsDiv.appendChild( newPara );
    }
}


function setFavoriteLink(isFavorited){
    var favLink = document.getElementById("favoriteListingLink");
    if(isFavorited){
        favLink.textContent = "Unfavorite";
    }
    else{
        favLink.textContent = "Favorite";
    }
}

function toggleFavorite(event){
    var favLink = document.getElementById("favoriteListingLink");
    event.preventDefault();
    if (event.defaultPrevented) {
        if(favLink.textContent == "Favorite"){
            requestFavorites("PUT");
            favLink.textContent = "Unfavorite";
        }
        else if(favLink.textContent == "Unfavorite"){
            requestFavorites("DELETE");
            favLink.textContent = "Favorite";
        }
    }
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
                // set textContext for favorite link of user
                setFavoriteLink(isFavorited);

                // make favorite link toggle
                document.getElementById("favoriteListingLink").onclick = toggleFavorite;
            }
        }

        if(request.status ==401){
            document.getElementById("favoriteListingLink").onclick = function(){
                //todo: handle 401 response - try sending a msg to login...
                document.getElementById("favoriteListingLink").href="/redirect";
            }
        }
    }
}