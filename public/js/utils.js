function createRequest() {
    try {
        request = new XMLHttpRequest();
    } catch (tryMS) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (otherMS) {
            try {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (failed) {
                request = null;
            }
        }
    }
    return request;
}

function isLength(element, min){
    "use strict"
    var elementID = element.id;
    var elementValue = element.value;
    var elementDiv = document.getElementById(elementID+"Div");
    var elementSpan = document.getElementById(elementID+"Span");

    if(elementValue.length < min){
        setFieldStatus(elementDiv, false);
        toggleShow(elementSpan, true, elementValue + " must contain at least " + min + " character(s).");
        return false;
    }
    setFieldStatus(elementDiv, true);
    toggleShow(elementSpan, false, "");
    return true;
}

function isEmail(element){
    "use strict";
    var elementID = element.id;
    var elementValue = element.value;
    var elementDiv = document.getElementById(elementID+"Div");
    var elementSpan = document.getElementById(elementID+"Span");

    if (!elementValue.match(/@/)){
        setFieldStatus(elementDiv, false);
        toggleShow(elementSpan, true, elementValue + " must be valid email");
        return false;
    }
    setFieldStatus(elementDiv, true);
    toggleShow(elementSpan, false, "");
    return true;
}

function isAlpha(element){
    "use strict";
    var elementID = element.id;
    var elementValue = element.value;
    var elementDiv = document.getElementById(elementID+"Div");
    var elementSpan = document.getElementById(elementID+"Span");

    if (!elementValue.match(/^[A-Za-z]+$/)){
        setFieldStatus(elementDiv, false);
        toggleShow(elementSpan, true, elementValue + " is not alpha");
        return false;
    }
    setFieldStatus(elementDiv, true);
    toggleShow(elementSpan, false, "");
    return true;
}

function isAlphanumeric(element){
    "use strict";

    var elementID = element.id;
    var elementValue = element.value;
    var elementDiv = document.getElementById(elementID+"Div");
    var elementSpan = document.getElementById(elementID+"Span");

    if(!elementValue.match(/^[A-Za-z]+/)){
        setFieldStatus(elementDiv, false);
        toggleShow(elementSpan, true, elementValue + " must start with a letter");
        return false;
    }

    if (!elementValue.match(/.*(?=.{6,})^[A-Za-z]+[a-zA-Z0-9]+$/)){
        setFieldStatus(elementDiv, false);
        toggleShow(elementSpan, true, elementValue + " is not alphanumeric");
        return false;
    }
    setFieldStatus(elementDiv, true);
    toggleShow(elementSpan, false, "");
    return true;
}

function setFieldStatus(elementDiv, status){
    "use strict";

    var successCSS = " has-success has-feedback";
    var errorCSS = " has-error has-feedback";

    toggleClass(elementDiv, successCSS, errorCSS, status);

}

function toggleClass(element, classOnTrue, classOnFalse, status){
    "use strict";

    // on success
    if(status){
        element.className = element.className.replace(classOnFalse, "");
        element.className = element.className.replace(classOnTrue, "");
        element.className = element.className + classOnTrue;
    }
    // on error
    else {
        element.className = element.className.replace(classOnFalse, "");
        element.className = element.className.replace(classOnTrue, "");
        element.className = element.className + classOnFalse;
    }
}

function toggleShow(element, status, msg){
    "use strict";

    // on true
    if(status){
        element.style.display = 'inline';
        if(msg.length > 0) element.textContent = msg;
    }
    // on false
    else {
        element.style.display = 'none';
    }
}

function floatLeft(element) {
    element.style.cssFloat = "left";
}

function showMsg(element, status, msg){
    "use strict";

    // on true
    if(status){
        //textContent
        if(msg.length > 0) element.innerText = msg;
        if(element.id == "listing-rent") element.textContent = msg;
    }
    // on false
    else {
        element.textContent = "";
    }
}