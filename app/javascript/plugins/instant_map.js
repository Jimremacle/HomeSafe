const instantiateMap = () => {
  // Retrieve the target element for the map:
  const targetElement = document.getElementById('mapContainer');
  const appId = targetElement.dataset.hereAppId
  const appCode = targetElement.dataset.hereAppCode

  // Instantiate a map and platform object:
  const platform = new H.service.Platform({
    'app_id': appId,
    'app_code': appCode,
    // 'ml'=eng,
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
    pixelRatio: pixelRatio,
    lg: 'ENG'
    });
}

export{ instantiateMap }
