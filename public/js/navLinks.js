$(document).ready(function () {
    var pathArray = window.location.pathname.split('/');
    var page = pathArray.pop();
    $('.selected a').removeClass('active');
    $('#' + page + 'Link').addClass('active');
});