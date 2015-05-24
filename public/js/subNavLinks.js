window.onload = init();

function init(){
    document.getElementById("favoriteListingLink").onclick = toggleFavorite;
}

//ToDo: save listing-id to user favorites array
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

function toggleFavorite(){
    var favLink = document.getElementById("favoriteListingLink");
    var favLinkTextContent = favLink.textContent;

    if(favLinkTextContent == "Favorite"){
        favLink.textContent = "Unfavorite";
        saveListing(event, "/deleteListingById");
    }
    else{
        favLink.textContent = "Favorite";
        saveListing(event, "/updateListingById");
    }
}
