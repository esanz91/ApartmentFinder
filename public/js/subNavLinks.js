window.onload = init();

function init(){
    document.getElementById("favoriteListingLink").onclick = saveListing;
}

//ToDo: save listing-id to user favorites array
function saveListing(event){
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
        var urlParam = encodeURIComponent(listingID);
        var url = "/findListingById/" + urlParam;
        request.onreadystatechange = function () {
            //Todo: handle error or null
            setMarkerLocations();
        };
        request.open("GET", url, true);
        request.send(null);

    }
}
