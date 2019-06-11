/**
 * An event listener is added to listen to tap events on the map.
 * Clicking on the map displays an alert box containing the latitude and longitude
 * of the location pressed.
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function setUpClickListener(map, ui) {
  // Attach an event listener to map display
  // obtain the coordinates and display in an alert box.


  let oldBubble = 0;

  map.addEventListener('tap', function (evt) {

    var coord = map.screenToGeo(evt.currentPointer.viewportX,
            evt.currentPointer.viewportY);
    //console.log(oldMarker);

    if (oldBubble !== 0) {
       ui.removeBubble(oldBubble)
      };

    const bubble = new H.ui.InfoBubble(coord, { content: `<div style="z-index: 0; position: relativ;"> <a href="/reports/new?coords=${coord}">Report an incident${coord}</a> </div>` })
    document.getElementById("report_address").innerHTML = coord


    ui.addBubble(bubble)

    oldBubble = bubble;
    //console.log(bubble)


    // map.addObject(marker);







    // alert('Clicked at ' + Math.abs(coord.lat.toFixed(4)) +
    //     ((coord.lat > 0) ? 'N' : 'S') +
    //     ' ' + Math.abs(coord.lng.toFixed(4)) +
    //      ((coord.lng > 0) ? 'E' : 'W'));
  });
}

export { setUpClickListener };


// Create an icon, an object holding the latitude and longitude, and a marker:



