const button = document.getElementById("safest_button");

button.addEventListener('click', () =>{

  const coordStart = targetElement.dataset.coordinatesStart;
    const coordEnd = targetElement.dataset.coordinatesEnd;
    let str = "";

    actualMarkers.forEach((marker) => {
      str += (marker.lat + 0.001) + ',' + (marker.lng - 0.001) + ";" + (marker.lat - 0.001) + ',' + (marker.lng + 0.001) + "!";
    });
    const avoid = str.substring(0, str.length - 1);

    function calculateRouteFromAtoB (platform) {
      const router = platform.getRoutingService(),

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
        routeRequestParams2,
        onSafeSuccess,
        onError
      );
    }


    function onSafeSuccess(result) {
      const route = result.response.route[0];

      addRouteShapeToMap(route, 'rgba(71, 196, 90, 0.7)');
      addManueversToMap(route, "#1ab631");

      addWaypointsToPanel(route.waypoint);
      addManueversToPanel(route);
      addSummaryToPanel(route.summary);
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

   // addMarker(targetElement, platform, ui);
    addMarkersAndSetViewBounds(map);
    addMarker(targetElement, platform, ui);
    setUpClickListener(map, ui);

  }

});
