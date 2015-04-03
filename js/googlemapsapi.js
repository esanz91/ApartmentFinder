function initialize() {
	
	var mapOptions = {
	  center: { lat: 40.758783, lng: -73.984634},
	  zoom: 14
	};
	
	var map = new google.maps.Map(document.getElementById('map-canvas'),
	    mapOptions);

	if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function (position) {
             initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
             map.setCenter(initialLocation);
             map.setZoom(14);
         });
     }
}

google.maps.event.addDomListener(window, 'load', initialize);