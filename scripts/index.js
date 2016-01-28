var earthquakes = [];
var layer;
var map;

//var earthquakeUrl = "http://earthquakescanada.nrcan.gc.ca/api/earthquakes/latest/365d.json";
var earthquakeUrl = "resources/365d.json";

$.get(earthquakeUrl, function(data) {
  var dataArray = [];

  for (var key in data) {

    if (data.hasOwnProperty(key) && key !== "metadata") {
      var quake = data[key];
      quake.type = "Feature";
      quake.geometry = quake.geoJSON;
      quake.geometry.coordinates = [quake.geometry.coordinates[1], quake.geometry.coordinates[0]];
      quake.properties = {"marker-symbol" : Math.floor(quake.magnitude), "title" : quake.magnitude + quake.magnitude_type};
      quake.date = new Date(quake.origin_time);
      quake.properties.description = quake.date.toLocaleDateString() + "<br />" + quake.depth + quake.depth_unit + " deep";

      earthquakes.push(quake);
    }
  }

  updateMarkers();
});


L.mapbox.accessToken = 'pk.eyJ1IjoiYmxhaW5lbGV3aXMxIiwiYSI6ImNpanVodW4xMzBmMHV1bmtnNW8wbjB6NzYifQ.gpU95UlnUDi7RQ-YP3wULw';

function updateMarkers() {
  var minMag = parseInt($("#min-mag").val());
  var maxMag = parseInt($("#max-mag").val());

  var startDate = new Date($("#start-date").val());
  var endDate = new Date($("#end-date").val());

  var filtered = [];

  for(var i = 0; i < earthquakes.length; i++){
    var quake = earthquakes[i];

    if(quake.magnitude > maxMag || quake.magnitude < minMag){
      continue;
    }

    if(quake.date > endDate || quake.date < startDate){
      continue;
    }

    filtered.push(quake);
  }

  if(layer !== undefined){
    map.removeLayer(layer);
  }

  layer = L.mapbox.featureLayer().setGeoJSON(filtered).addTo(map);
}

$(function(){
  $(".expander").click(
    function() {
      $(".expander").parent().children(".expandable").toggle();
      $(".expander").toggleClass("down").toggleClass("up");
    }
  );
  $(".expander").addClass("down");
  $(".expandable").hide();

  var today = new Date();
  var oneYearEarlier = new Date();
  oneYearEarlier.setFullYear(oneYearEarlier.getFullYear() - 1);

  $("#end-date").val(today.toJSON().slice(0,10));
  $("#start-date").val(oneYearEarlier.toJSON().slice(0,10));

  $("#min-mag").val(3);
  $("#max-mag").val(8);

  $("#filter").click(updateMarkers);

  map = L.mapbox.map('map', 'mapbox.streets')
    .setView([62.2270, -105.3809], 4);

});
