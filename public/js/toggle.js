$(function() {
   $('.selected').click(function() {
       $('.selected').removeClass('active');
       $(this).addClass('active');
   });
});