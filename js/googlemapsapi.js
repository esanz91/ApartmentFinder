function createMap() {
	geocoder = new google.maps.Geocoder();

	var latlng = new google.maps.LatLng(-34.397, 150.644);
  	var mapOptions = {
    	center: latlng,
    	zoom: 8
  	}
	
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function (position) {
             initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
             map.setCenter(initialLocation);
             map.setZoom(14);
         });
     }
 
     document.getElementById("searchbutton").onclick=function(){
        codeAddress(map);
    }

}

function codeAddress(map) {
    var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();
            alert(latitude);
            alert(longitude);
            var latlng = new google.maps.LatLng(latitude, longitude);
            map.setCenter(latlng);


			/*map.setCenter(results[0].geometry.location);*/
			var marker = new google.maps.Marker({
			    map: map,
			    position: results[0].geometry.location
			});
		} else {
		alert("Geocode was not successful for the following reason: " + status);
		}
	});
}	

//google.maps.event.addDomListener(window, 'load', initialize);
