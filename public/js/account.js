window.onload = init();

function init() {
    var pathArray = window.location.pathname.split('/');
    var page = pathArray.pop();

    if (page == 'search') {
        document.getElementById("favoriteListingLink").onclick = toggleFavorite;
    }
    else if (page == 'account') {
        requestUserFavorites("GET", displayFavorites);
        //document.getElementById("user-favorites").onclick = toggleFavoriteDiv;
        $('#user-favorites').click(function(){
            $('#favorite-listings-div').toggle();
        });
    }
}

function toggleFavorite() {
    var favLink = document.getElementById("favoriteListingLink");

    if (favLink.textContent == "Favorite") {
        requestUserFavorites("PUT", null);
        favLink.textContent = "Unfavorite";
    }
    else if (favLink.textContent == "Unfavorite") {
        requestUserFavorites("DELETE", null);
        favLink.textContent = "Favorite";
    }
}

function toggleFavoriteDiv() {
    //TODO: create better VIEW (modify displayFavorites)
    //requestUserFavorites("GET", displayFavorites);

}

function requestUserFavorites(httpRequest, successCallback) {
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

function getFavorites(successCallback) {
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
        else if (request.status == 401) {
            // TODO: create errorCallback to handle 401
            if (response.msg == "unauthorized") {
                console.log("unauthorized");
                document.getElementById("favoriteListingLink").onclick = function () {
                    //todo: handle 401 response - try sending a msg to login...
                    document.getElementById("favoriteListingLink").href = "/redirect";
                }
            }
        }
        // on NOT FOUND
        else if (request.status == 404) {
            // TODO: create errorCallback to handle 404
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
        else if (request.status == 500) {
            // TODO: create errorCallback to handle 500
            if (response.msg == "error") {
                console.log(response.error);
            }
        }
    }
}

function traverseUserFavorites(response) {
    console.log("called traverseUserFavorites");
    var isFound = false;
    var listingID = document.getElementById("listing-id").textContent;
    for (var i = 0; i < response.favorites.length; i++) {
        if (response.favorites[i]['_id'] == listingID) {
            console.log("favorited: " + response.favorites[i]['_id']);
            isFound = true;
            break;
        }
    }
    setFavoriteLink(isFound);
}

function setFavoriteLink(favoriteBool) {
    console.log("called setFavoriteLink");
    var favLink = document.getElementById("favoriteListingLink");
    if (favoriteBool) {
        console.log("favorited");
        favLink.textContent = "Unfavorite";
    }
    else {
        console.log("not favorited");
        favLink.textContent = "Favorite";
    }
}

// TODO: modify function to display better VIEW
function displayFavorites(response) {
    console.log("called displayFavorites");
    // TODO: filter favorites by city, date

    var favoriteListingsDiv = document.getElementById("favorite-listings-div");
    for (var i = 0; i < response.favorites.length; i++) {
        var address = response.favorites[i].address;
        var div = document.createElement("div");
        var header = document.createElement("p");
        var headerAddress = document.createElement("p");
        var headerText = document.createTextNode(address.administrative_area_level_1 + " / " + address.locality);
        var headerAddressText = document.createTextNode(address.formatted_address);
        console.log(headerText.textContent + "\n" + headerAddressText.textContent);
        header.innerHTML = headerText.textContent;
        headerAddress.innerHTML = headerAddressText.textContent;

        div.appendChild(header);
        div.appendChild(headerAddress);
        div.appendChild(document.createElement("hr"))
        favoriteListingsDiv.appendChild(div);
    }
}


// ================
// UNUSED FUNCTIONS
// ================

function requestUsername() {
    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    request.onreadystatechange = function () {
        getUsername();
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
                console.log("username: " + response.username);
                callback("GET", traverseUserFavorites);
            }
        }
        // on NOT FOUND
        if (request.status == 404) {
            if (response.msg == "not found") {
                console.log("user not logged in");
                document.getElementById("favoriteListingLink").onclick = function () {
                    // TODO: find better way to handle 404 response
                    document.getElementById("favoriteListingLink").href = "/redirect";
                }
            }
        }
    }
}