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
        var url = "/updateListingById/" + urlParam;
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var response = JSON.parse(request.responseText);
                    if (response.msg == "error") {
                        console.log(response.locations[0]);
                        alert("error!");
                    }
                    if (response.msg == "match") {
                        console.log("match");
                        console.log()
                        console.log(response.locations[0]);
                    }
                }
            }
        };
        request.open("GET", url, true);
        request.send(null);

    }
}

