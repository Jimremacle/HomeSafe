import { addMarker } from "./init_geolocation";
import  { setUpClickListener } from "./init_clickposition";
import { safestRoute } from "./init_saferoute";
// import { calculateSafeRouteFromAtoB } from "./init_saferoute";
// import { instantiateMap } from "./instant_map";

const initMap = () => {

  // Retrieve the target element for the map:
  const targetElement = document.getElementById('mapContainer');
  if(!targetElement) {return};
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
    ppi: pixelRatio === 1 ? undefined : 320,
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



  const actualMarkers = JSON.parse(targetElement.dataset.markers); //moved out of scope for areas to avoid
  // Lets add markers and have the map focus on them
  function addMarkersAndSetViewBounds() {
    const group = new H.map.Group();
    map.addObject(group);

    const reports = []
    let bubbles = [];

    group.addEventListener('tap', function (evt) {
    // event target is the marker itself, group is a parent event target
    // for all objects that it contains

    evt.stopPropagation();

      bubbles.forEach((bubble) => {
        ui.removeBubble(bubble)
      });

      var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
        // read custom data
        content: evt.target.getData()
      });

      bubbles.push(bubble);

      // show info bubble
      setTimeout(function(){ ui.addBubble(bubble); }, 10);

     }, false);

    //change marker colour based on condition
    const iconPhysical = new H.map.Icon('https://res.cloudinary.com/khaotyl/image/upload/v1560161914/icons8-marker-32_gbpv0n.png');
    const iconVerbal = new H.map.Icon('https://res.cloudinary.com/khaotyl/image/upload/v1560163227/icons8-marker-32_3_tvjayi.png');
    const iconFeeling = new H.map.Icon('https://res.cloudinary.com/khaotyl/image/upload/v1560161914/icons8-marker-32_2_ggypsx.png');

    actualMarkers.forEach((marker) => {
      if (marker.type == "Physical") {
        var markerObject = new H.map.Marker({lat:marker.lat, lng:marker.lng}, {icon: iconPhysical})
      } else if(marker.type == "Verbal") {
        var markerObject = new H.map.Marker({lat:marker.lat, lng:marker.lng}, {icon: iconVerbal})
      } else {
        var markerObject = new H.map.Marker({lat:marker.lat, lng:marker.lng}, {icon: iconFeeling})
      }

      // markerObject.setData('div');
      markerObject.setData(marker.infoWindow);
      reports.push(markerObject);
    });

    group.addObjects(reports);
    // get geo bounding box for the group and set it to the map
    map.setViewBounds(group.getBounds());


  };


  //Step 3: make the map interactive
  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));


  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  //Begining of routing *********************
  const coordStart = targetElement.dataset.coordinatesStart;
  const coordEnd = targetElement.dataset.coordinatesEnd;
  let str = "";

  actualMarkers.forEach((marker) => {
    str += (marker.lat + 0.001) + ',' + (marker.lng - 0.001) + ";" + (marker.lat - 0.001) + ',' + (marker.lng + 0.001) + "!";
  });
  const avoid = str.substring(0, str.length - 1);

  function calculateRouteFromAtoB (platform) {
    const router = platform.getRoutingService(),
      routeRequestParams = {
        mode: 'shortest;pedestrian',
        representation: 'display',
        waypoint0: coordStart,
        waypoint1: coordEnd,
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action'
        // avoidareas: avoid
      },

            routeRequestParams2 = {
        mode: 'shortest;pedestrian',
        representation: 'display',
        waypoint0: coordStart,
        waypoint1: coordEnd,
        routeattributes: 'waypoints,summary,shape,legs',
        maneuverattributes: 'direction,action',
        avoidareas: avoid,
      };


    router.calculateRoute(
      routeRequestParams,
      onFastSuccess,
      onError
    );


    router.calculateRoute(
      routeRequestParams2,
      onSafeSuccess,
      onError
    );
  }

  function toggleDisplay(route, rgbaCode, hexCode) {
    // lets read the input of the slider
    addRouteShapeToMap(route, rgbaCode);
    addManueversToMap(route, hexCode);
    addWaypointsToPanel(route.waypoint);
    addManueversToPanel(route);
    addSummaryToPanel(route.summary);
    // if the value is 0 - display safe route navigation

    // if the value is 1 - display fast route navigation
  }

  function onFastSuccess(result) {
    const route = result.response.route[0];
    const hex = "#1b468d";
    const rgba = 'rgba(0, 128, 255, 0.7)';

    addRouteShapeToMap(route, rgba);
    addManueversToMap(route, hex);

    const toggler = document.getElementById('routeToggle');

    toggler.addEventListener("click", () => {
      if (toggler.value === "1") {
        toggleDisplay(route, rgba, hex)
      }
    });
  }


  function onSafeSuccess(result) {
    const route = result.response.route[0];
    const hex = "#1ab631";
    const rgba = 'rgba(71, 196, 90, 0.7)';

    addRouteShapeToMap(route, rgba);
    addManueversToMap(route, hex);
    const toggler = document.getElementById('routeToggle');

    toggler.addEventListener("click", () => {
      if (toggler.value === "0") {
        toggleDisplay(route, rgba, hex)
      }
    });

    toggleDisplay(route, rgba, hex);
  }

  function onError(error) {
    alert('Ooops!');
  }

  /**
   * Creates a H.map.Polyline from the shape of the route and adds it to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addRouteShapeToMap(route, color){
    var lineString = new H.geo.LineString(),
      routeShape = route.shape,
      polyline;

    routeShape.forEach(function(point) {
      const parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: color
      }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.setViewBounds(polyline.getBounds(), true);
  }


  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addManueversToMap(route, color){
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
        `fill="${color}" stroke="white" stroke-width="1"  />` +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
      group = new  H.map.Group(),
      i,
      j;

    // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        const maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        const marker =  new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude} ,
          {icon: dotIcon});
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }

    group.addEventListener('tap', function (evt) {
      map.setCenter(evt.target.getPosition());
      openBubble(
         evt.target.getPosition(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
  }

  //end of simple routing line **************************


const routeInstructionsContainer = document.getElementById('instructionsContainer');

  function addWaypointsToPanel(waypoints){



    var nodeH3 = document.createElement('h3'),
      waypointLabels = [],
      i;


     for (i = 0;  i < waypoints.length; i += 1) {
      waypointLabels.push(waypoints[i].label)
     }

     nodeH3.textContent = waypointLabels.join(' - ');



    routeInstructionsContainer.innerHTML = '';
    routeInstructionsContainer.appendChild(nodeH3);
  }

  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addSummaryToPanel(summary){
    var summaryDiv = document.createElement('div'),
     content = '';
     content += '<b>Total distance</b>: ' + summary.distance / 1000 + 'km. <br/>';
     content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft ='5%';
    summaryDiv.style.marginRight ='5%';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
  }

  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  function addManueversToPanel(route){



    var nodeOL = document.createElement('ol'),
      i,
      j;

    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft ='5%';
    nodeOL.style.marginRight ='5%';
    nodeOL.className = 'directions';

       // Add a marker for each maneuver
    for (i = 0;  i < route.leg.length; i += 1) {
      for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
        // Get the next maneuver.
        var maneuver = route.leg[i].maneuver[j];

        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');

        spanArrow.className = 'arrow '  + maneuver.action;
        spanInstruction.innerHTML = maneuver.instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);

        nodeOL.appendChild(li);
      }
    }

    routeInstructionsContainer.appendChild(nodeOL);
  }


  Number.prototype.toMMSS = function () {
    return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
  }




  calculateRouteFromAtoB (platform);
  // calculateSafeRouteFromAtoB (platform);
  setUpClickListener(map, ui);
 // addMarker(targetElement, platform, ui);
  addMarkersAndSetViewBounds(map);

  addMarker(targetElement, platform, ui);

  // switchMapLanguage(map, platform);

}


export { initMap };
