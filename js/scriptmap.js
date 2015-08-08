var map2000, service2000, infoWindow2000;
var markers2000 = [];
var currentImg2000; 
var totalImg2000; 
var autocomplete2000;
var MARKER_PATH2000 = imgdefault_2000;
var hostnameRegexp2000 = new RegExp('^https?://.+?/');
var zoomm2000=14;
var refreshIntervalId2000; 
var typestruct1="restaurant"; 
 
/**
 	* Function for creating google maps with hotels 
 	*/	
function setMap2000(lat,lng) {
	 
	  var llc = new google.maps.LatLng(lat,lng);
                
	  map2000 = new google.maps.Map(document.getElementById('map-canvas2000'), {
		center: llc,
		zoom: zoomm2000
	  });
	  
	   var request2000 = {
		location: llc,
		radius: 3500,
		types: ["restaurant","bar"]
	  };
	 
  		infowindow2000 = new google.maps.InfoWindow({
		  		content: document.getElementById('info-content2000')
		  	});
		  	google.maps.event.addListener(infowindow2000,'closeclick',function(){
		  clearInterval(refreshIntervalId2000);
		   
		});
	  		service2000 = new google.maps.places.PlacesService(map2000);
	  		service2000.nearbySearch(request2000, callback2000);
		 
	       
	    google.maps.event.addListener(map2000,'dragend',function() {
			 lat = map2000.getCenter().lat();
			 lng = map2000.getCenter().lng();
			  var llc = new google.maps.LatLng(lat,lng);
			 var request2000 = {
				location: llc,
				radius: 3500,
				types: ["restaurant","bar"]
			  };
			var  infowindow2000 = new google.maps.InfoWindow({
		  		content: document.getElementById('info-content2000')
		  	});
		  	
		  	google.maps.event.addListener(infowindow2000,'closeclick',function(){
		  clearInterval(refreshIntervalId2000);
		 
		});
	  		service2000 = new google.maps.places.PlacesService(map2000);
	  		service2000.nearbySearch(request2000, callback2000);
			  
		});
	   
	 if (search_2000!="") { 
	  
	 
	
		document.getElementById('searchcontent2000').style.display="inline"
 
	 	var input = document.getElementById('pac-input');

	  	var types = document.getElementById('type-selector');
	  	map2000.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	   

	  	var autocomplete2000 = new google.maps.places.Autocomplete(input);
	  	autocomplete2000.bindTo('bounds', map2000);
	 
	  	service2000 = new google.maps.places.PlacesService(map2000);
	  	service2000.nearbySearch(request2000, callback2000);
 
		

		google.maps.event.addListener(autocomplete2000, 'place_changed', function() {
		 
	
			var place = autocomplete2000.getPlace();
			if (!place.geometry) {
			  window.alert("autocomplete2000's returned place contains no geometry");
			  return;
			}

			 
			  map2000.setCenter(place.geometry.location);
			  map2000.setZoom(zoomm2000);   
			   var marker = new google.maps.Marker({
				position: place.geometry.location,
				map: map2000
				}); 
  
	 
			var request2000 = {
				location: place.geometry.location,
				radius: 3500,
				types: ["restaurant","bar"]
			  };
			var  infowindow2000 = new google.maps.InfoWindow({
		  		content: document.getElementById('info-content2000')
		  	});
		  	 google.maps.event.addListener(infowindow2000,'closeclick',function(){
		  clearInterval(refreshIntervalId2000);
		  
		});
	  		service2000 = new google.maps.places.PlacesService(map2000);
	  		service2000.nearbySearch(request2000, callback2000);
	  		 
			 
	  });
	 }  
	  		 
	}



/**
 	* Function for initializing google maps 
 	*/	
function initialize2000() {
 
  if (address_2000!='' && lat_2000=='' && lng_2000=='') {
   
 	var geocoder = new google.maps.Geocoder();
  
 	geocoder.geocode({ 'address': address_2000 }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat_2000 = results[0].geometry.location.lat();
                     lng_2000 = results[0].geometry.location.lng();
 					 setMap2000(lat_2000,lng_2000);
                } else {
                    alert("Request failed.")
                }
            });
            
           
  } else {
  	setMap2000(lat_2000,lng_2000);
  }
 
}
 
/**
 	* Function for creating google maps with hotels
 	*/	
	function callback2000(results, status) {
 
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
			clearResults2000();
		   clearmarkers2000();
		for (var i = 0; i < results.length; i++) {
		//console.log(results[i]);
	  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
			var photos = results[i].photos;
			var markerIcon = MARKER_PATH2000;
			var ff = "";
			if (photos) {
				markerIcon = photos[0].getUrl({'maxWidth': 500, 'minHeight': 500});
 				ff = markerIcon;
			}
		
			/* 
			markers2000[i] = new google.maps.Marker({
			  position: results[i].geometry.location,
			  animation: google.maps.Animation.DROP,
			  icon: markerIcon
			});
			*/
			var ido = Math.floor((Math.random()*20000)+1);
			 
		 
			markers2000[i] = new google.maps.Marker({
				  position: results[i].geometry.location,
				  map: map2000,
				  icon: imgdefault_2000
			  });
	   
			markers2000[i].placeResult = results[i];
		 
			google.maps.event.addListener(markers2000[i], 'click', showInfoWindow2000);
			setTimeout(dropMarker2000(i), i * 100);
			 
		 
	 
		}
		var t=i+1;
		var center = map2000.getCenter();
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"latLng":center},function(data,status){
 			if(status == google.maps.GeocoderStatus.OK){
 				var add = data[1].formatted_address; //this is the full address
				 
				markers2000[t] = new google.maps.Marker({
						position: center,
						map: map2000,
						 title: add
  					});
  					markers2000[t].placeResult = null;
			}
		})
		
		 
				 
  		
  		 
		 addResult2000();
	  	}
	}
	
	 
/**
 	* Function for clearing results on listing
 	*/		
	
	function clearResults2000() {
	  var results = document.getElementById('results2000');
	  while (results.childNodes[0]) {
		results.removeChild(results.childNodes[0]);
	  }
	}
	
/**
 	* Function for clearing markers2000 on map
 	*/		
	function clearmarkers2000() {
	  for (var i = 0; i < markers2000.length; i++) {
		if (markers2000[i]) {
		  markers2000[i].setMap(null);
		}
	  }
	  markers2000 = [];
	}
/**
 	* Function for dropping markers2000 on map 
 	*/		
	function dropMarker2000(i) {
	  return function() {
		markers2000[i].setMap(map2000);
	  };
	}

 
/**
 	* Change row color background for result table
 	*/	 
	function clickRow2000(id){
        google.maps.event.trigger(markers2000[id], 'click');
        document.getElementById("idrow"+id).style.backgroundColor="#F5F6CE";
    }
    
    /**
 	* Function for adding results on listing
 	*/	
	function addResult2000() {
	  var i;
	  var distance;
	  var arrayMarker = new Array();
	  var center = map2000.getCenter();
	   for (i in markers2000) {
	  	 if (markers2000[i]) {
	   		if (markers2000[i].placeResult) {
				var rs = markers2000[i].placeResult;
				var markerLatLng = rs.geometry.location;
				var distance = parseInt(google.maps.geometry.spherical.computeDistanceBetween(center, markerLatLng)); 
				arrayMarker.push([[distance,markers2000[i],i]]);
			}	
			}
	   }
	 
	
		 var col=0;
		 var asc=1;
		  arrayMarker.sort(function(a, b){
			return (parseInt(a[col]) == parseInt(b[col])) ? 0 : ((parseInt(a[col]) > parseInt(b[col])) ? asc : -1*asc);
		});
     
	  var results = document.getElementById('results2000');
	 var j;
	 var i;
     for (j in arrayMarker) {
     
 		var distance = arrayMarker[j][0][0];
 		var marker = arrayMarker[j][0][1];
 		var i = arrayMarker[j][0][2];
	 	var rs = marker.placeResult;
	 	 
		var tr = document.createElement('tr');
		tr.setAttribute("id","idrow"+i);
	  	tr.style.backgroundColor = (j % 2 == 0 ? '#F0F0F0' : '#FFFFFF');
 	  	var nameTd = document.createElement('td');
	    var titled = document.createElement('div');
	    
	    titled.innerHTML='<span style="cursor:pointer; color: #cf4d35;" onclick="clickRow2000('+i+')"><b >' + rs.name;
	    if (rs.photos) {
	    	 titled.innerHTML+= "&nbsp;&#128247;";
	    }
	    titled.innerHTML+= '</b></span>';
	    
	    nameTd.appendChild(titled);
	      
	       var texth = '';
		  var imgh = "";
		  var ratingHtml = '';
		  if (rs.rating) {
	   
			for (var h = 0; h < 5; h++) {
			  if (rs.rating < (h + 0.5)) {
				ratingHtml += '&#10025;';
			  } else {
				ratingHtml += '&#10029;';
			  }
		  
			}
			  texth +=  ratingHtml+"<br>";
		  }
		  texth+=rs.vicinity+"<br>";
	   texth+=distance +' mt.';
	    texth+='<div id="spanwebid'+rs.place_id+'"></div>';
	  	texth+='<div id="spanphoneid'+rs.place_id+'"></div>';	 
	 
	   var bt2 = document.createElement('span'); 
	       bt2.innerHTML = texth;
	  
	  //var name = document.innerHTML(text);
	   nameTd.appendChild(bt2);
 
     

	  tr.appendChild(nameTd);
	  
	  
	  
	  results.appendChild(tr);
	  
	 
	  
	  
	 	 
		
	  }
	
 
	} 
	
	
	
	 
	 
	
	/**
 	* show infowindow on map
 	*/	
	function showInfoWindow2000() {
		if (document.getElementById('info-content2000') && document.getElementById('info-content2000').style.display=="none") {
			document.getElementById('info-content2000').style.display = 'block';
		}

	  var marker = this;
	  service2000.getDetails({placeId: marker.placeResult.place_id},
		  function(place, status) {
		   
			if (status != google.maps.places.PlacesServiceStatus.OK) {
			  return;
			}
			infowindow2000.open(map2000, marker);
			buildIWContent2000(place);
		  });
	}
	
	/**
 	* Function for sliding images on infowindow
 	*/	
	function viewImg2000() {
		for(var i=0;i<totalImg2000;i++) {
			document.getElementById("imgslider"+i).style.display="none";
		}
		if (currentImg2000>=totalImg2000) {
			currentImg2000=0;
		}
		document.getElementById("imgslider"+currentImg2000).style.display="block";
		currentImg2000++;
	 
	 
		 
	}
	/**
 	* Function for loading the place information into the HTML elements used by the info window.
 	*/	
	 
	function buildIWContent2000(place) {
		 var html='';
		  clearInterval(refreshIntervalId2000);
		 currentImg2000=0;
		 totalImg2000=0;
	 var info = "";
		if (place.photos) {
	 	     var ff="";
	 	     var prima = place.photos[0].getUrl({'maxWidth': 500, 'maxHeight': 500});
			 for(var v=0;v<place.photos.length;v++) {
				 ff = place.photos[v].getUrl({'maxWidth': 500, 'maxHeight': 500});
			 
				 if (ff!="") {
					html += '<img class="mapsslider" style="display:none;" id="imgslider'+v+'" width="200px" src="'+ff+'"/>';
				 }
			 }	
			totalImg2000 = v;	
		}
		if (html!="") {
			document.getElementById('iw-image').style.display = '';
			document.getElementById('slider2000').innerHTML = html;
		   	viewImg2000();
			  refreshIntervalId2000 = setInterval(function() { viewImg2000();}, 3000);
			 
		} else {
			document.getElementById('iw-image').style.display = 'none';
			document.getElementById('slider2000').innerHTML = "";
		}
		
		  info = '<b><a target="_blank" href="' + place.url + '">' + place.name + '</a></b>';
		  if (place.rating) {
				var ratingHtml = '';
				for (var i = 0; i < 5; i++) {
				  if (place.rating < (i + 0.5)) {
					ratingHtml += '&#10025;';
				  } else {
					ratingHtml += '&#10029;';
				  }
			}
			  info+="<br>"+ratingHtml;
	  	}
		info+="<br>Address: "+place.vicinity;
		if (place.formatted_phone_number) {
			var phone="<br>Phone: "+'<a href="tel:'+place.formatted_phone_number+'">'+place.formatted_phone_number+'</a>';
			info+=phone;
			document.getElementById('spanphoneid'+place.place_id).innerHTML = phone;
		}
		
 
	  if (place.website) {
		var website = place.website;
	 
		if (website.indexOf("http")==-1) {
		  website = 'http://' + website + '/';
		}
		website='<a href="'+website+'" target="_blank">'+website+"</a>";
		info+="<br>Website: "+website
		document.getElementById('spanwebid'+place.place_id).innerHTML = "Website: "+website;
	  }  
	  document.getElementById('iw-info').innerHTML = info;
	  
	  	 
	}


 
  // initialise google maps
	google.maps.event.addDomListener(window, 'load', initialize2000);

 