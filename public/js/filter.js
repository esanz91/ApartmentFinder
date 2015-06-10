$(document).ready(function(){
    $("#filter-link").click(function(){
        $('#map-canvas').removeClass("content-65-width");
        $('#search-content').hide();
        $('#filter-content-div').slideToggle("slow");
        if($(window).width()-($(window).width() *.75) <= 300){
            $('#map-canvas').toggleClass("max-map-size", "add");
            $('#map-canvas').toggleClass("content-full-width", "remove");
        }
        else{
            $('#map-canvas').toggleClass("content-75-width");
        }
    });

    $(".filter").change(function(){
        requestListings();
    });

    $( window ).resize(function() {
        if($(window).width()-($(window).width() *.75) <= 300 && $('#filter-content-div').is(':visible')){
            $('#map-canvas').addClass("max-map-size");
            $('#map-canvas').removeClass("content-full-width");
        }
    });

/*
    $('#selecctall').click(function(event) {  //on click
        if(this.checked) { // check select status
            $('.checkbox1').each(function() { //loop through each checkbox
                this.checked = true;  //select all checkboxes with class "checkbox1"
            });
        }else{
            $('.checkbox1').each(function() { //loop through each checkbox
                this.checked = false; //deselect all checkboxes with class "checkbox1"
            });
        }
    });
*/

});