// populate # of bedrooms
$(function () {
    var maxOption = $('<option></option>');
    maxOption.attr('value', null);
    maxOption.text("any");
    $('#maxBedrooms').append(maxOption);
    for (var i = 0; i <= 6; i++) {
        if (i == 0) {
            var minOption = $('<option></option>');
            minOption.attr('value', i);
            minOption.text("studio");
            $('#minBedrooms').append(minOption);
            $('#bedrooms').append(minOption);

            var maxOption = $('<option></option>');
            maxOption.attr('value', i);
            maxOption.text("studio");
            $('#maxBedrooms').append(maxOption);
        }
        else {
            var minOption = $('<option></option>');
            minOption.attr('value', i);
            minOption.text(i);
            $('#minBedrooms').append(minOption);
            $('#bedrooms').append(minOption);

            var maxOption = $('<option></option>');
            maxOption.attr('value', i);
            maxOption.text(i);
            $('#maxBedrooms').append(maxOption);
        }
    }
});

//populate # of bathrooms
$(function () {
    var maxOption = $('<option></option>');
    maxOption.attr('value', null);
    maxOption.text("any");
    $('#maxBathrooms').append(maxOption);

    for (var i = 1; i <= 6; i = i + .5) {
        var minOption = $('<option></option>');
        minOption.attr('value', i);
        minOption.text(i);
        $('#minBathrooms').append(minOption);
        $('#bathrooms').append(minOption);

        var maxOption = $('<option></option>');
        maxOption.attr('value', i);
        maxOption.text(i);
        $('#maxBathrooms').append(maxOption);
    }
});