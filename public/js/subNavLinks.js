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

function saveListing(event, url){
    var element = document.getElementById("listing-id");
    console.log("id: " + element.textContent);
    event.preventDefault();

    if (event.defaultPrevented) {
        // create request
        var request = createRequest();
        if (null === request) {
            console.log("Could not create request");
            return;
        }

        // init request
        var listingID = element.textContent;
        var postData = "listingID="+listingID;
        //var urlParam = encodeURIComponent(listingID);
        request.onreadystatechange = function () {
            favoriteListing();
        };
        request.open("POST", url, true);
        request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        request.send(postData);
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
        }
    }
}

function setFavoriteLink(isFavorited){
    var favLink = document.getElementById("favoriteListingLink");
    //var favLinkTextContent = favLink.textContent;

    if(isFavorited){
        favLink.textContent = "Unfavorite";
        //saveListing(event, "/deleteListingById");
    }
    else{
        favLink.textContent = "Favorite";
        //saveListing(event, "/updateListingById");
    }
}
