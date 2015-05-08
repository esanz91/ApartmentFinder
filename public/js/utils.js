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

    if(elementValue.length < min){
        setFieldStatus(elementID, false);
        setSpanMsg(elementID, false, elementValue + " must contain at least " + min + " character(s).");
        return false;
    }
    setFieldStatus(elementID, true);
    setSpanMsg(elementID, true, "");
    return true;
}

function isEmail(element){
    "use strict";
    var elementID = element.id;
    var elementValue = element.value;

    if (!elementValue.match(/@/)){
        setFieldStatus(elementID, false);
        setSpanMsg(elementID, false, elementValue + " must be valid email");
        return false;
    }
    setFieldStatus(elementID, true);
    setSpanMsg(elementID, true, "");
    return true;
}

function isAlpha(element){
    "use strict";
    var elementID = element.id;
    var elementValue = element.value;

    if (!elementValue.match(/^[A-Za-z]+$/)){
        setFieldStatus(elementID, false);
        setSpanMsg(elementID, false, elementValue + " is not alpha");
        return false;
    }
    setFieldStatus(elementID, true);
    setSpanMsg(elementID, true, "");
    return true;
}

function isAlphanumeric(element){
    "use strict";
    var elementID = element.id;
    var elementValue = element.value;

    if(!elementValue.match(/^[A-Za-z]+/)){
        setFieldStatus(elementID, false);
        setSpanMsg(elementID, false, elementValue + " must start with a letter");
        return false;
    }

    if (!elementValue.match(/.*(?=.{6,})^[A-Za-z]+[a-zA-Z0-9]+$/)){
        setFieldStatus(elementID, false);
        setSpanMsg(elementID, false, elementValue + " is not alphanumeric");
        return false;
    }
    setFieldStatus(elementID, true);
    setSpanMsg(elementID, true, "");
    return true;
}

function setFieldStatus(elementID, status){
    "use strict";

    var elementDiv = document.getElementById(elementID+"Div");
    var successCSS = " has-success has-feedback";
    var errorCSS = " has-error has-feedback";

    // on success
    if(status){
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

function setSpanMsg(elementID, status, msg){
    "use strict";

    var elementSpan = document.getElementById(elementID+"Span");

    // on success
    if(status){
        elementSpan.style.display = 'none';
    }
    // on error
    else {
        elementSpan.style.display = 'inline';
        elementSpan.textContent = msg;
    }
}