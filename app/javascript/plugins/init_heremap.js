import {addMarker} from "./init_geolocation";

const initMap = () => {

  // Retrieve the target element for the map:
  const targetElement = document.getElementById('mapContainer');
  const appId = targetElement.dataset.hereAppId
  const appCode = targetElement.dataset.hereAppCode
  console.log

  // Instantiate a map and platform object:
  const platform = new H.service.Platform({
    'app_id': appId,
    'app_code': appCode,
    useHTTPS: true
  });

  //some stuff to zoom and move on map?
  const pixelRatio = window.devicePixelRatio || 1;
  const defaultLayers = platform.createDefaultLayers({
    tileSize: pixelRatio === 1 ? 256 : 512,
    ppi: pixelRatio === 1 ? undefined : 320
  });

  // Instantiate the map:
  const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.normal.map,{
    center: {lat:50, lng:5},
    zoom: 4,
    pixelRatio: pixelRatio
    });

  // Lets add markers and have the map focus on them
  function addMarkersAndSetViewBounds() {
    const group = new H.map.Group();
    map.addObject(group);

    const reports = []
    const actualMarkers = JSON.parse(targetElement.dataset.markers);
    let bubbles = [];

    group.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains

    bubbles.forEach((bubble) => {
      ui.removeBubble(bubble)
    });

    var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
      // read custom data
      content: evt.target.getData()
    });
    bubbles.push(bubble);
    // show info bubble
    // console.log(evt.target.getData())
    ui.addBubble(bubble);
    }, false);

    actualMarkers.forEach((marker) => {
      const markerObject = new H.map.Marker({lat:marker.lat, lng:marker.lng})
      // markerObject.setData('div');
      markerObject.setData(marker.infoWindow);
      reports.push(markerObject);
    });

    group.addObjects(reports);
    // get geo bounding box for the group and set it to the map
    map.setViewBounds(group.getBounds());


  };



  // ------------------------- Geocoding starts here
  // Create the parameters for the geocoding request:

  //Step 3: make the map interactive
  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);


  // // Create the parameters for the geocoding request:

  // const geocodingParams = {
  //     searchText: 'Rue de la Fraternité Schaerbeek'
  //   };

  // Define a callback function to process the geocoding response:

  // const onResult = function(result) {
  //   const locations = result.Response.View[0].Result;
  //     position,
  //     marker;
  //   // Add a marker for each location found
  //   for (i = 0;  i < locations.length; i++) {
  //   position = {
  //     lat: locations[i].Location.DisplayPosition.Latitude,
  //     lng: locations[i].Location.DisplayPosition.Longitude
  //   };
  //   marker = new H.map.Marker(position);
  //   map.addObject(marker);
  //   }
  // };

  // Get an instance of the geocoding service:
  // const geocoder = platform.getGeocodingService();

  // Call the geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):

  // geocoder.geocode(geocodingParams, onResult, function(e) {
  //   alert(e);
  // });
  addMarkersAndSetViewBounds(map)

  addMarker(targetElement, platform, ui);
}


export {initMap}
