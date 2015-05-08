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
    var elementID = this.id;
    var userInput = this.value;
    var urlParam = encodeURIComponent(userInput);
    if ((elementID == "firstName") || (elementID == "lastName")) {
        var url = "/api/validate/name/" + urlParam;
    }
    else if (elementID == "username") {
        var url = "/api/validate/username/" + urlParam;
    }
    else if (elementID == "email") {
        var url = "/api/validate/email/" + urlParam;
    }
    else if (elementID == "password") {
        var url = "/api/validate/password/" + urlParam;
    }
    request.onreadystatechange = function(){showUsernameStatus(elementID);};
    request.open("GET", url, true);
    request.send(null);
}

function showUsernameStatus (elementID){
    "user strict"

    if (request.readyState == 4) {
        if (request.status == 200) {
            var elementDiv = document.getElementById(elementID+"Div");
            var successCSS = " has-success has-feedback";
            var errorCSS = " has-error has-feedback";
            // on success
            if(request.responseText == "okay"){
                elementDiv.className = elementDiv.className.replace(errorCSS, "");
                elementDiv.className = elementDiv.className.replace(successCSS, "");
                elementDiv.className = elementDiv.className + successCSS;
            }
            // on error
            else {
                elementDiv.className = elementDiv.className.replace(errorCSS, "");
                elementDiv.className = elementDiv.className.replace(successCSS, "");
                elementDiv.className = elementDiv.className + errorCSS;
            }
        }
    }
}