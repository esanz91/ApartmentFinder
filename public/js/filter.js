$(document).ready(function(){
    $("#filter-link").click(function(){
        $('#map-canvas').removeClass("content-65-width");
        $('#search-content').hide();
        $("#filter-content-div").slideToggle("slow");
        $('#map-canvas').toggleClass("content-75-width");
    });

    $("#bedrooms").change(function(){
        requestListings();
    });
});