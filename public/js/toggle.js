function toggle_visibility(elementId) {
    $('.right-sidebar').hide(); // this hides all other divs;
    $('#' + elementId).show(); // show clicked div
}

$(function() {
   $('.selected').click(function() {
       $('.selected').removeClass('active');
       $(this).addClass('active');
   });
});