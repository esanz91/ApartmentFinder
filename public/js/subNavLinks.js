/*
window.onload = init();
var username;

function init(){
    requestUsername()
    //document.getElementById("favoriteListingLink").onclick = toggleFavorite;
}

function requestUsername(){
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
*/
/*
function getUsername(){
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if(response.msg == "error"){
                alert("error");
            }
            if (response.msg == "no matches") {
                username = null;

            }
            if (response.msg == "match") {
                username = response.username;
            }
        }
    }
}
*/

function requestListingAction(action){
    if (event.defaultPrevented) {
        // create request
        var request = createRequest();
        if (null === request) {
            console.log("Could not create request");
            return;
        }

        // init request
        var listingID = document.getElementById("listing-id").textContent;
        var url = "/user/favorites/" + listingID;
        //var postData = "listingID="+listingID;
        //var urlParam = encodeURIComponent(listingID);

        console.log("id: " + listingID);

        request.onreadystatechange = function () {
            favoriteListing();
        };
        //request.open("POST", url, true);
        //request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        //request.send(postData);
        if(action == "DELETE") {
            console.log("delete requested");
            request.open("DELETE", url, true);
            request.send(null);
        }
        if(action == "PUT") {
            console.log("put requested");
            request.open("PUT", url, true);
            request.send(null);
        }

    }
}

function favoriteListing(){
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            if (response.msg == "error") {
                console.log("error");
            }
            if (response.msg == "match") {
                console.log("match");
            }
            if (response.msg == "no matches") {
                console.log("no matches");
            }
            if (response.msg == "not deleted") {
                console.log("not deleted");
            }
            if (response.msg == "deleted") {
                console.log("deleted");
            }
        }
    }
}

function setFavoriteLink(isFavorited){
    var favLink = document.getElementById("favoriteListingLink");
    if(isFavorited){
        //requestListingAction("/updateListingById");
        requestListingAction("PUT");
        favLink.textContent = "Unfavorite";
    }
    else{
        //requestListingAction("/deleteListingById");
        requestListingAction("DELETE");
        favLink.textContent = "Favorite";
    }
}

function toggleFavorite(event){
    var elementText = document.getElementById("favoriteListingLink").textContent;
    event.preventDefault();
    console.log(event.defaultPrevented);
    if (event.defaultPrevented) {
        if(elementText == "Favorite"){
            setFavoriteLink(true);
        }
        if(elementText == "Unfavorite"){
            setFavoriteLink(false);
        }
    }
}