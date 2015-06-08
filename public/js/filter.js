$(document).ready(function(){
    $("#filter-link").click(function(){
        $('#map-canvas').removeClass("content-65-width");
        $('#search-content').hide();
        $("#filter-content-div").slideToggle("slow");
        $('#map-canvas').toggleClass("content-75-width");
    });

    $("#minBedrooms").change(function(){
        requestListings();
    });

    $("#maxBedrooms").change(function(){
        requestListings();
    });

    $("#minBathrooms").change(function(){
        requestListings();
    });

    $("#maxBathrooms").change(function(){
        requestListings();
    });

    $("#minRent").change(function(){
        requestListings();
    });

    $("#maxRent").change(function(){
        requestListings();
    });
});