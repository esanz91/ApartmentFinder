function toggle_visibility(elementId) {
    $('.content .rightsidebar').hide(); // this hides all other divs;
    $('.content #' + elementId).show(); // show clicked div
}
$('.content .rightsidebar').hide();

$(function() {
   $('.selected').click(function() {
       $('.selected').removeClass('active');
       $(this).addClass('active');
   });
});