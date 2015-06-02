window.onload = init();

//account.handlebars
function init(){
    document.getElementById("userFavorites").onclick = setUserFavoritesRequest;
}

function setUserFavoritesRequest(){
    //TODO: create better VIEW (modify displayFavorites)
    requestUserFavorites("GET", displayFavorites);
}

function requestUserFavorites(httpRequest, successCallback){
    console.log("called requestUserFavorites");

    // set url
    var baseUrl = "/user/favorites/";
    var url;
    var listingID;
    if (document.getElementById("listing-id")) {
        listingID = document.getElementById("listing-id").textContent;
        url = baseUrl + listingID;
    }

    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init and send request
    // on UPDATE
    if (httpRequest == "PUT") {
        console.log("put requested");
        // set callback
        request.onreadystatechange = function () {
            getFavorites();
        };
        request.open("PUT", url, true);
        request.send(null);
    }
    // on DELETE
    else if (httpRequest == "DELETE") {
        console.log("delete requested");
        // set callback
        request.onreadystatechange = function () {
            getFavorites();
        };
        request.open("DELETE", url, true);
        request.send(null);
    }
    // on READ
    else if (httpRequest == "GET") {
        console.log("get requested");

        // set callback
        request.onreadystatechange = function () {
            getFavorites(successCallback);
        };

        request.open("GET", baseUrl, true);
        request.send(null);
    }
}

function getFavorites(successCallback){
    if (request.readyState == 4) {
        var response = JSON.parse(request.responseText);
        console.log("called getFavorites\n");

        // on OK
        if (request.status == 200) {
            if (response.msg == "found") {
                console.log("found");
                successCallback(response);
            }
            if (response.msg == "deleted") {
                console.log("deleted");
            }
            if (response.msg == "updated") {
                console.log("updated");
            }
        }
        // on UNAUTHORIZED
        if(request.status == 401){
            console.log("user unauthorized");
            document.getElementById("favoriteListingLink").onclick = function(){
                //todo: handle 401 response - try sending a msg to login...
                document.getElementById("favoriteListingLink").href="/redirect";
            }
        }
        // on NOT FOUND
        if(request.status == 404){
            if (response.msg == "not found") {
                console.log("not found");
            }
            if (response.msg == "not updated") {
                console.log("not updated");
            }
            if (response.msg == "not deleted") {
                console.log("not deleted");
            }
        }
        // on INTERNAL SERVER ERROR
        if(request.status == 500){
            if (response.msg == "error") {
                console.log(response.error);
            }
        }
    }
}

// TODO: modify function to display better VIEW
function displayFavorites(response){
    console.log("called displayFavorites");
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
            requestUserFavorites("PUT", null);
            favLink.textContent = "Unfavorite";
        }
        else if(favLink.textContent == "Unfavorite"){
            requestUserFavorites("DELETE", null);
            favLink.textContent = "Favorite";
        }
    }
}

function printFavorites(response){
    console.log("called printFavorites");

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


function requestUsername() {
    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    request.onreadystatechange = function () {
        // TODO: fix this
        getUsername(requestUserFavorites);
    };
    var url = "/user";
    request.open("GET", url, true);
    request.send(null);
}

function getUsername(callback) {
    if (request.readyState == 4) {
        var response = JSON.parse(request.responseText);

        // on OK
        if (request.status == 200) {
            if (response.msg == "found") {
                console.log("getUsername: " + username);
                callback("GET", displayFavorites);
            }
        }
        // on NOT FOUND
        if (request.status == 404) {
            if (response.msg == "not found") {
                console.log("user not logged in");
                document.getElementById("favoriteListingLink").onclick = function(){
                    // TODO: find better way to handle 404 response
                    document.getElementById("favoriteListingLink").href="/redirect";
                }

            }
        }
    }
}