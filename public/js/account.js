window.onload = init();

function init(){
    document.getElementById("userFavorites").onclick = setRequest;
}

function setRequest(){
    requestFavorites("GET");
}
