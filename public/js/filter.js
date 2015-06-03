window.onload = init();

function init() {
    var pathArray = window.location.pathname.split('/');
    var page = pathArray.pop();

    if (page == 'search') {
        document.getElementById("filter-link").onclick = toggleFilter;
    }
}

function toggleFilter(){
    var element = this;
    var value = element.getAttribute("data-click-value");

    var listingNav = document.getElementById("listing-nav");
    var searchContentDiv = document.getElementById("search-content");
    var filterContentDiv = document.getElementById("filter-content-div");
    var mapCanvas = document.getElementById("map-canvas");

    var navCssToRemove = listingNav.getAttribute("class");
    var searchCssToRemove = searchContentDiv.getAttribute("class");
    var mapCssToRemove = mapCanvas.getAttribute("class");
    var filterCssToRemove =  filterContentDiv.getAttribute("class");

    if(value == "off") {
        element.setAttribute("data-click-value", "on");

        var navCssToAdd = "content-display-none";
        var searchCssToAdd = "content-display-none";
        var filterCssToAdd = "content-display-inline-block right-sidebar content-text";
        var mapCssToAdd = "content-75-width content-float-left";

        toggleClass(listingNav, navCssToAdd, navCssToRemove, true);
        toggleClass(searchContentDiv, searchCssToAdd, searchCssToRemove, true);
        toggleClass(filterContentDiv, filterCssToAdd, filterCssToRemove, true);
        toggleClass(mapCanvas, mapCssToAdd, mapCssToRemove, true);
    }
    else{
        element.setAttribute("data-click-value", "off");

        var contentCssToAdd = "content-display-none";
        var mapCssToAdd = "content-full-width";

        toggleClass(filterContentDiv, contentCssToAdd, filterCssToRemove, true);
        toggleClass(mapCanvas, mapCssToAdd, mapCssToRemove, true);
    }
}