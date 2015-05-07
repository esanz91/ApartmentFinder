window.onload = validateFields();

function validateFields(){
    document.getElementById("username").onblur = checkUsername;
}

function checkUsername(){
    "use strict"
    var request = createRequest();
    if(null === request){
        console.log("Could not create request");
    }
    else{
        var userInput = document.getElementById("username").value;
        var username = encodeURIComponent(userInput);
        var url = "/users/" + username;
        request.onreadystatechange = showUsernameStatus;
        request.open("GET", url, true);
        request.send(null);
    }
}

function showUsernameStatus(){
    "user strict"
    if(request.readyState == 4){
        if(request.status == 200){
            alert(request.responseText);
        }
    }
}