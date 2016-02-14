var map;        
var myCenter=new google.maps.LatLng(geoplugin_latitude(), geoplugin_longitude());
var marker=new google.maps.Marker({
    position:myCenter
});

function initialize() {
  var mapProp = {
      center:myCenter,
      zoom: 5,
      streetViewControl: false,
	  disableDefaultUI: true,
      mapTypeId:google.maps.MapTypeId.TERRAIN
  };
  
  map=new google.maps.Map(document.getElementById("map-canvas"), mapProp);
  marker.setMap(map);
    
  google.maps.event.addListener(marker, 'click', function() {
 	var infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent('<h4>' + "You are here(ish)" + '</h4');
    infoWindow.open(map, marker);
    
  }); 
};

function resizeMap() {
   if(typeof map =="undefined") return;
   setTimeout( function(){resizingMap();} , 400);
}

function resizingMap() {
   if(typeof map =="undefined") return;
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
}
