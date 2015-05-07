window.onload = init();

function init() {
    document.getElementById("firstName").onblur = validateField;
    document.getElementById("lastName").onblur = validateField;
    document.getElementById("username").onblur = validateField;
    document.getElementById("email").onblur = validateField;
    document.getElementById("password").onblur = validateField;
}
function validateField() {
    "user strict"

    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    var userInput = this.value;
    var urlParam = encodeURIComponent(userInput);
    if ((this.id == "firstName") || (this.id == "lastName")) {
        var url = "/api/validate/name/" + urlParam;
    }
    else if (this.id == "username") {
        var url = "/api/validate/username/" + urlParam;
    }
    else if (this.id == "email") {
        var url = "/api/validate/email/" + urlParam;
    }
    else if (this.id == "password") {
        var url = "/api/validate/password/" + urlParam;
    }
    request.onreadystatechange = showUsernameStatus;
    request.open("GET", url, true);
    request.send(null);

}

function showUsernameStatus() {
    "user strict"
    if (request.readyState == 4) {
        if (request.status == 200) {
            //Todo: replace alert action with css modifications based on responseText to indicate any errors
            alert(request.responseText);
        }
    }
}