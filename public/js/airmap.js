var pm25_gap = [0, 11, 23, 35, 41, 47, 53, 58, 64, 70],
    pm25_gap_color = ['#c9e7a7', '#00ff00', '#0c0', '#ff0', '#f3c647', '#e46c0a', '#d99694', '#ff0000', '#800000', '#7030a0'];
var pm25_NASA_gap = [0, 3, 5, 8, 10, 13, 15, 18, 20, 35, 50, 65],
    pm25_NASA_gap_color = ['#0000cc', '#03c', '#06f', '#09f', '#3cf', '#6f9', '#9f6', '#cf3', '#ff0', '#ff9833', '#ff3300', '#f30', '#c00', '#800000'];
var temp_gap = [0, 5, 10, 15, 20, 25, 30, 35, 40],
    temp_gap_color = ['#215968', '#b7dee8', '#77933c', '#d7e4bd', '#fac090', '#e46c0a', '#ff0000', '#800000'];
var humi_gap = [20, 40, 60, 80],
    humi_gap_color = ['#fac090', '#76b531', '#b7dee8', '#215968'];
var marker_view = 1;
var air_group = ['LASS', 'Airbox', 'Indie', 'ProbeCube'];
var marker = {'LASS': [], 'Airbox': [], 'Indie': [], 'ProbeCube': []};
var air_site = [];

var windytyInit = {
  // Required: API key
  key: 'PsL-At-XpsPTZexBwUkO7Mx5I',

  // Optional: Initial state of the map
  lat: 23.854271,
  lon: 120.951906,
  zoom: 8,
}

var html = '<table width="100%"><tbody><tr><td>空氣溫度</td><td>-- °C</td></tr><tr><td>相對濕度</td><td>-- %</td></tr><tr><td>PM2.5</td><td>-- μg/m<sup>3</sup></td></tr></tbody></table>';
// Required: Windyty main function is called after
// initialization of API
//
// @map is instance of Leaflet maps
//
function windytyMain(map) {
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    opacity: 0.3
  }).addTo(map);
  // var $range = $('#range'),
  //     $state = $('#state');

  // // Set minimum and maximum timestamp value
  // // for current overlay. Do not forget to check
  // // time boundaries after changing overlay.
  // range.max = W.timeline.end;
  // range.min = W.timeline.start;

  // // Handle change of <input range>
  // range.onchange = function(event) {
  //   W.setTimestamp(+event.target.value)
  // }

  // // Display actual state of a map
  // W.on('redrawFinished',function( displayedParams ) {
  //   state.innerHTML = new Date( displayedParams.timestamp ).toString();
  // },'test')
  
  
  $.each(air_group, function(ik, iv) {
    $.getJSON('./json/' + iv + '_last.json', function(data) {
      air_site[iv] = [];
      var num = 0;
      $.each(data, function(jk, jv) {
        var siteName = jv.SiteName,
            siteType = jv.SiteGroup,
            channelId = (typeof jv.Channel_id == "undefined" ? '' : jv.Channel_id),
            pm25 = (typeof jv.Data.Dust2_5  == "undefined" ? '-' : jv.Data.Dust2_5),
            humidity = (typeof jv.Data.Humidity === "undefined" ? '-' : jv.Data.Humidity),
            temperature = (typeof jv.Data.Temperature === "undefined" ? '-' : jv.Data.Temperature),
            last_time = jv.Data.Create_at,
            lat = jv.LatLng.lat,
            lng = jv.LatLng.lng;
        if(lat != null && lng != null) {
          air_site[iv][num] = {siteName: siteName,
                              siteType: siteType,
                              channelId: channelId,
                              pm25: pm25,
                              humidity: humidity,
                              temperature: temperature,
                              last_time: last_time,
                              lat: lat,
                              lng: lng};
          marker[iv][num] = L.circleMarker([lat, lng], {color: markerColor(pm25)})
                            .bindPopup(info_html(siteName, siteType, channelId, pm25, humidity, temperature, last_time));
          num++;
        }
      });
      $.each(marker[iv], function(key, val) {
        try {
          val.addTo(map);
        }
        catch(err) {
          console.log(air_site[iv]);
          console.log(err.message);
        }
        
      });
    });
  });
}

$('#type-menu button').click(function() {
  marker_view = parseInt($(this).attr('value'));
  switch (marker_view) {
    case 1:
    case 2:
      $.each(air_group, function(ik, iv) {
        $.each(marker[iv], function(jk, jv) {
          jv.setStyle({color: markerColor(air_site[iv][jk].pm25)});
        });
      });
      break;
    case 3:
      $.each(air_group, function(ik, iv) {
        $.each(marker[iv], function(jk, jv) {
          jv.setStyle({color: markerColor(air_site[iv][jk].temperature)});
        });
      });
      break;
    case 4:
      $.each(air_group, function(ik, iv) {
        $.each(marker[iv], function(jk, jv) {
          jv.setStyle({color: markerColor(air_site[iv][jk].humidity)});
        });
      });
      break;
  }
});

function markerColor(data) {
  var color = '#000';
  switch(marker_view) {
    case 1:
      $.each(pm25_gap, function(key, val) {
        if(data >= val)
          color = pm25_gap_color[key];
      });
      break;
    case 2:
      $.each(pm25_NASA_gap, function(key, val) {
        if(data >= val)
          color = pm25_NASA_gap_color[key];
      });
      break;
    case 3:
      $.each(temp_gap, function(key, val) {
        if(data >= val)
          color = temp_gap_color[key];
      });
      break;
    case 4:
      $.each(humi_gap, function(key, val) {
        if(data >= val)
          color = humi_gap_color[key];
      });
      break;
  }
  if (data == null) color = '#000';

  return color;
}

function info_html(siteName, siteType, channelId, pm25, humidity, temperature, last_time) {
  if (pm25 == null) pm25 = '-';
  var url;
  switch(siteType) {
    case 'LASS':
      url = 'http://nrl.iis.sinica.edu.tw/LASS/show.php?device_id=' + siteName;
      break;
    case 'EPA':
      url = 'https://thingspeak.com/channels/' + channelId;
      break;
  }
  
  return '<div class="info-window"><a href="' + url + '" target="_blank"><h4>' + siteName + '</h4></a><p class="last_time">資料時間 ' + last_time + '</p><table><tbody><tr><td>PM2.5</td><td>' + pm25 + ' μg/m<sup>3</sup></td></tr><tr><td>空氣溫度</td><td>'+ temperature +' °C</td></tr><tr><td>相對濕度</td><td>'+ humidity +' %</td></tr></tbody></table></div>';
}

// PM25 s_d0
// temperature s_t0
//  HUMIDITY s_d0