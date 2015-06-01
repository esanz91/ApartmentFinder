//populate # of bedrooms
$(function () {
    for (var i = 0; i <= 6; i++) {
        if (i == 0) {
            var option = $('<option></option>');
            option.attr('value', i);
            option.text("studio");
            $('#bedrooms').append(option);
        }
        else {
            var option = $('<option></option>');
            option.attr('value', i);
            option.text(i);
            $('#bedrooms').append(option);
        }
    }
});

//populate # of bathrooms
$(function () {
    for (var i = 0.5; i <= 6; i = i + .5) {
        var option = $('<option></option>');
        option.attr('value', i);
        option.text(i);
        $('#bathrooms').append(option);
    }
});