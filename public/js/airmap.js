var dust2_5_NASA_gap = [0, 3, 5, 8, 10, 13, 15, 18, 20, 35, 50, 65];
var color_icon = ['./img/cdn0.png',
																			'./img/cdn1.png',
																			'./img/cdn2.png',
																			'./img/cdn3.png',
																			'./img/cdn4.png',
																			'./img/cdn5.png',
																			'./img/cdn6.png',
																			'./img/cdn7.png',
																			'./img/cdn8.png',
																			'./img/cdn9.png',
																			'./img/cdn10.png',
																			'./img/cdn11.png',
																			'./img/cdn12.png']
var windytyInit = {
	// Required: API key
	key: 'PsL-At-XpsPTZexBwUkO7Mx5I',

	// Optional: Initial state of the map
	lat: 23.854271,
	lon: 120.951906,
	zoom: 8,
}  

// Required: Windyty main function is called after 
// initialization of API
//
// @map is instance of Leaflet maps
//
function windytyMain(map) {
	$.getJSON('./json/LASS_last.json', function(data) {
			$.each(data, function(ik, iv) {
				// console.log(iv);
				var  SiteName = iv.SiteName,
						pm25 = iv.RawData.s_d0,
						lat = iv.RawData.gps_lat,
						lng = iv.RawData.gps_lon;
 
				$.each(dust2_5_NASA_gap, function(jk, jv) {
					 /* iterate through array or object */
				});

				L.marker([lat, lng], {icon: color(pm25)})
					.bindPopup(SiteName).openPopup()
					.addTo(map);
			});
	});
}

function color(pm25) {
	var num = 0;
	$.each(dust2_5_NASA_gap, function(key, val) {
		if(pm25 >= val)
			num = key;
	});
	return L.icon({iconUrl: color_icon[num]});
}


// PM25 s_d0
// temperature s_t0
//  HUMIDITY s_d0