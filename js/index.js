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
      quake.properties = {"marker-symbol" : Math.floor(quake.magnitude), "title" : quake.magnitude};
      quake.date = new Date(quake.origin_time);
      quake.properties.description = quake.date.toLocaleDateString();

      earthquakes.push(quake);
    }
  }

  updateMarkers();
});


L.mapbox.accessToken = 'pk.eyJ1IjoiYmxhaW5lbGV3aXMxIiwiYSI6ImNpanVodW4xMzBmMHV1bmtnNW8wbjB6NzYifQ.gpU95UlnUDi7RQ-YP3wULw';

function updateMarkers() {
  var minMag = parseInt($("#min-mag").val());
  var maxMag = parseInt($("#max-mag").val());

  var startDate = new Date($("#startDate").val());
  var endDate = new Date($("#startDate").val());

  var filtered =[];

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
  $("#min-mag").change(updateMarkers);
  $("#max-mag").change(updateMarkers);
  $("#start-date").change(updateMarkers);
  $("#end-date").change(updateMarkers);

  map = L.mapbox.map('map', 'mapbox.streets')
    .setView([54.3950, -116.8092], 8);
});
