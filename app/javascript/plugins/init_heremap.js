const initMap = () => {

  // Retrieve the target element for the map:
  const targetElement = document.getElementById('mapContainer');
  const appId = targetElement.dataset.hereAppId
  const appCode = targetElement.dataset.hereAppCode

  // Instantiate a map and platform object:
  const platform = new H.service.Platform({
    'app_id': appId,
    'app_code': appCode
  });

  // Get default map types from the platform object:
  const defaultLayers = platform.createDefaultLayers();

  // Instantiate the map:
  const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.normal.map,
    {
    zoom: 15,
    center: { lat: 50.860309, lng: 4.363870 }
    });

  // Create the parameters for the geocoding request:
  const geocodingParams = {
      searchText: 'Rue de la Fraternité Schaerbeek'
    };

  // Define a callback function to process the geocoding response:
  const onResult = function(result) {
    const locations = result.Response.View[0].Result;
      position,
      marker;
    // Add a marker for each location found
    for (i = 0;  i < locations.length; i++) {
    position = {
      lat: locations[i].Location.DisplayPosition.Latitude,
      lng: locations[i].Location.DisplayPosition.Longitude
    };
    marker = new H.map.Marker(position);
    map.addObject(marker);
    }
  };

  // Get an instance of the geocoding service:
  const geocoder = platform.getGeocodingService();

  // Call the geocode method with the geocoding parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  geocoder.geocode(geocodingParams, onResult, function(e) {
    alert(e);
  });
}


export {initMap}
