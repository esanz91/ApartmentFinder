window.onload = init();

function init() {
    document.getElementById("firstName").onblur = validateField;
    document.getElementById("lastName").onblur = validateField;
    document.getElementById("username").onblur = validateField;
    document.getElementById("email").onblur = validateField;
    document.getElementById("password").onblur = validateField;
}

function validateField() {
    "use strict";

    //initial validation
    var element = this;

    // is name alpha
    if ((element.id == "firstName") || (element.id == "lastName")) {
        if (!isLength(element, 2)) return;
        if (!isAlpha(element)) return;
        // all checks for name complete, exit now
        return;
    }

    //is username alphanumeric
    else if (element.id == "username") {
        if (!isLength(element, 6)) return;
        if (!isAlphanumeric(element)) return;
    }

    // is email
    else if (element.id == "email") {
        if(!isEmail(element)) return;
    }

    // is password of length
    else if(element.id == "password") {
        if(!isLength(element, 6)) return;
        //Todo: add one more layer of verification (i.e. at least one number, etc)
        // all checks for password complete, exit now
        return;
    }

    // create request
    var request = createRequest();
    if (null === request) {
        console.log("Could not create request");
        return;
    }

    // init request
    var userInput = element.value;
    var urlParam = encodeURIComponent(userInput);
    var url = "/api/validate/" + element.id + "/" + urlParam;

    request.onreadystatechange = function () {
        showFieldStatus(element);
    };
    request.open("GET", url, true);
    request.send(null);

}

function showFieldStatus(element) {
    "use strict";
    var elementID = element.id;
    var elementValue = element.value;

    if (request.readyState == 4) {
        if (request.status == 200) {
            if (request.responseText == "username available") {
                setFieldStatus(elementID, true);
                setSpanMsg(elementID, true, "");
                return;
            }
            if (request.responseText == "username unavailable") {
                setFieldStatus(elementID, false);
                setSpanMsg(elementID, false, elementValue + " is unavailable");
                return;
            }
            if (request.responseText == "username not alphanumeric") {
                setFieldStatus(elementID, false);
                setSpanMsg(elementID, false, elementValue + " is not alphanumeric");
                return;
            }
            if (request.responseText == "email okay"){
                setFieldStatus(elementID, true);
                setSpanMsg(elementID, true, "");
                return;
            }
            if (request.responseText == "email on file"){
                setFieldStatus(elementID, false);
                setSpanMsg(elementID, false, elementValue + " is already in use");
                return;
            }
            if (request.responseText == "no email format"){
                setFieldStatus(elementID, false);
                setSpanMsg(elementID, false, elementValue + " is not a valid email");
                return;
            }
        }
    }
}